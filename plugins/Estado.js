// comando_status_bot.js
// Comando para generar un informe detallado del bot: uptime, latencia, chats, grupos, memoria, CPU, versiones, propietarios, etc.
// Diseñado para bots con baileys/whatsapp. Adaptalo según tu estructura de comandos.

import os from 'os'
import { execSync } from 'child_process'

let handler = async (m, { conn, usedPrefix, command, participants, isOwner }) => {
  try {
    // permisos: opcional — dejar abierto o solo owner
    // if (!isOwner) return m.reply('Solo el owner puede usar este comando.')

    const uptimeSeconds = process.uptime()
    const uptime = formatDuration(uptimeSeconds)

    // Memoria
    const memTotal = os.totalmem()
    const memFree = os.freemem()
    const memUsed = memTotal - memFree

    // CPU (promedio simple por core)
    const cpus = os.cpus()
    const cpuModel = cpus[0].model
    const cpuCores = cpus.length
    const load = os.loadavg() // [1min,5min,15min]

    // Node / Platform
    const nodeVersion = process.version
    const platform = `${os.type()} ${os.arch()} ${os.release()}`

    // Process memory usage
    const pMem = process.memoryUsage()

    // Número de chats / grupos (según la estructura de conn)
    let chatsCount = 0
    let groupsCount = 0
    let privateChats = 0
    try {
      // compatibilidad con diferentes stores
      const store = conn.store || conn.chats || {}
      const chatKeys = Object.keys(store)
      // si store es un Map (nueva estructura) convertir
      const entries = chatKeys.length ? chatKeys : (store.chats ? Object.keys(store.chats) : [])

      // alternativa: usar conn.chats.array() si existe
      const allJids = []
      if (conn.chats && typeof conn.chats === 'object' && !Array.isArray(conn.chats)) {
        // conn.chats puede ser un objeto con keys
        for (let k of Object.keys(conn.chats)) allJids.push(k)
      } else if (Array.isArray(conn.chats)) {
        for (let item of conn.chats) allJids.push(item.id || item.jid)
      } else if (Array.isArray(entries)) {
        for (let k of entries) allJids.push(k)
      }

      // filtrar jids válidos
      const uniq = Array.from(new Set(allJids)).filter(Boolean)
      chatsCount = uniq.length
      groupsCount = uniq.filter(j => j.endsWith('@g.us')).length
      privateChats = chatsCount - groupsCount
    } catch (e) {
      // en caso de error, dejar contadores a 0
    }

    // Información de propietarios (si existe en conn.info o global config)
    const ownerInfo = (conn.user && conn.user.id) ? `${conn.user.name || 'Bot'} (${conn.user.id})` : (conn.info ? JSON.stringify(conn.info) : 'Desconocido')

    // Latencia: medir envío rápido y borrado (si el entorno lo permite)
    let latency = 'N/A'
    try {
      const start = Date.now()
      const sent = await conn.sendMessage(m.chat, { text: '⏱ comprobando latencia...' })
      const elapsed = Date.now() - start
      latency = `${elapsed} ms`
      // intentar borrar el mensaje de comprobación (si la API/permite)
      try { await conn.deleteMessage(m.chat, { id: sent.key.id, remoteJid: m.chat, fromMe: true }) } catch (err) { /* no crítico */ }
    } catch (err) {
      latency = 'No disponible (error al enviar mensaje de prueba)'
    }

    // Información de versión del bot (poner manualmente o leer package.json)
    let pkgInfo = {}
    try {
      pkgInfo = JSON.parse(execSync('cat package.json').toString())
    } catch (e) {
      // fallback
      pkgInfo = { name: 'bot', version: 'desconocida' }
    }

    // Construir reporte (texto). Nota: aquí no incluimos datos extensos como listas largas de chats
    // pero mostramos resumen y un CSV opcional adjunto con detalles de chats si el usuario lo requiere.

    let report = []
    report.push(`🔎 Informe del Bot — ${pkgInfo.name} v${pkgInfo.version}`)
    report.push(`• Uptime: ${uptime} (${Math.floor(uptimeSeconds)}s)`)
    report.push(`• Latencia: ${latency}`)
    report.push(`• Plataforma: ${platform}`)
    report.push(`• Node: ${nodeVersion}`)
    report.push(`• CPU: ${cpuModel} — ${cpuCores} cores`)
    report.push(`• Loadavg (1m/5m/15m): ${load.map(n=>n.toFixed(2)).join(' / ')}`)
    report.push(`• Memoria total: ${formatBytes(memTotal)} — usada: ${formatBytes(memUsed)} — libre: ${formatBytes(memFree)}`)
    report.push(`• Proceso RSS/Heap/External: rss=${formatBytes(pMem.rss)}, heapUsed=${formatBytes(pMem.heapUsed)}, external=${formatBytes(pMem.external || 0)}`)
    report.push(`• Chats totales: ${chatsCount} (Grupos: ${groupsCount} • Privados: ${privateChats})`)
    report.push(`• Owner / Identidad del bot: ${ownerInfo}`)

    // enviar reporte con opciones
    const textReport = report.join('\n')
    await conn.sendMessage(m.chat, { text: textReport })

    // Opcional: enviar CSV con lista de chats y su tipo (si el usuario pidió 'full' o es owner)
    // NOTA: aquí generamos solo si es owner para evitar spam
    if (isOwner) {
      try {
        const store = conn.store || conn.chats || {}
        const allJids = []
        if (conn.chats && typeof conn.chats === 'object' && !Array.isArray(conn.chats)) {
          for (let k of Object.keys(conn.chats)) allJids.push(k)
        } else if (Array.isArray(conn.chats)) {
          for (let item of conn.chats) allJids.push(item.id || item.jid)
        }
        const uniq = Array.from(new Set(allJids)).filter(Boolean)
        const lines = ['jid,type,name']
        for (let jid of uniq) {
          const isGroup = jid.endsWith('@g.us')
          let name = ''
          try { name = await conn.getName(jid) } catch (e) { name = '' }
          lines.push(`${jid},${isGroup ? 'group' : 'private'},"${name.replace(/"/g, '""')}"`)
        }
        const csv = lines.join('\n')
        await conn.sendMessage(m.chat, { document: Buffer.from(csv), fileName: 'chats_list.csv', mimetype: 'text/csv' })
      } catch (e) {
        // no crítico
      }
    }

  } catch (err) {
    console.error(err)
    m.reply('Ocurrió un error al generar el informe: ' + err.message)
  }
}

// helpers
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

function formatDuration(seconds) {
  seconds = Math.floor(seconds)
  const d = Math.floor(seconds / (3600*24))
  seconds %= 3600*24
  const h = Math.floor(seconds / 3600)
  seconds %= 3600
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${d}d ${h}h ${m}m ${s}s`
}

handler.command = ['status','report','estado','informe']
export default handler
