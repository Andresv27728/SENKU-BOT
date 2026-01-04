import ws from "ws"
import fetch from "node-fetch"

// --------------------------
// PERSONALIZA AQUÍ LA IMAGEN
// Pon la URL pública de la imagen que quieras usar como miniatura
const CUSTOM_CONTACT_IMAGE_URL = "https://files.catbox.moe/qd3b71.png"
// --------------------------

async function makeFkontak(customImageUrl) {
  try {
    const res = await fetch(customImageUrl, { timeout: 10000 })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const thumb = Buffer.from(await res.arrayBuffer())

    // vCard simple (puedes personalizar nombre y teléfono)
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Senku;;;',
      'FN:Laboratorio Senku',
      'TEL;type=CELL;type=VOICE;waid=YO SOY YO:573133374132',
      'END:VCARD'
    ].join('\n')

    return {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'CONTACT-SENKU' },
      message: {
        contactMessage: {
          displayName: 'Laboratorio Senku',
          vcard,
          jpegThumbnail: thumb
        }
      },
      participant: '0@s.whatsapp.net'
    }
  } catch (e) {
    console.error('makeFkontak error:', e?.message || e)
    return null
  }
}

const handler = async (m, { conn, participants, usedPrefix }) => {
  try {
    // recopilar bots
    const allBots = [
      global.conn?.user?.jid,
      ...(global.conns || [])
        .filter(c => c.user?.jid && c.ws?.socket?.readyState !== ws.CLOSED)
        .map(c => c.user.jid)
    ].filter(Boolean)

    function convertirMsADiasHorasMinutosSegundos(ms) {
      const segundos = Math.floor(ms / 1000)
      const minutos = Math.floor(segundos / 60)
      const horas = Math.floor(minutos / 60)
      const días = Math.floor(horas / 24)
      const segRest = segundos % 60
      const minRest = minutos % 60
      const horasRest = horas % 24
      let resultado = ""
      if (días) resultado += `${días}d `
      if (horasRest) resultado += `${horasRest}h `
      if (minRest) resultado += `${minRest}m `
      if (segRest) resultado += `${segRest}s`
      return resultado.trim() || "unos segundos"
    }

    const groupBots = allBots.filter(bot => participants.some(p => p.id === bot))

    const botsGroupText = groupBots.length > 0
      ? groupBots.map(bot => {
          const isMainBot = bot === global.conn.user.jid
          const subSock = (global.conns || []).find(c => c.user?.jid === bot)
          const uptime = isMainBot
            ? convertirMsADiasHorasMinutosSegundos(Date.now() - (global.conn.uptime || Date.now()))
            : subSock?.isInit
              ? convertirMsADiasHorasMinutosSegundos(Date.now() - (subSock?.uptime || Date.now()))
              : "Activo desde ahora"
          const mention = bot.replace(/[^0-9]/g, "")
          return `⚗️ @${mention}\n   🧩 Rol: ${isMainBot ? "Bot Principal" : "Sub-Bot"}\n   ⏱️ Activo: ${uptime}`
        }).join("\n\n")
      : "❌ No hay bots activos en este grupo."

    // texto limpio: sin saltos extraños ni espacios al inicio/final
    const message = [
      "〔 ⚗️ LABORATORIO DE SENKU ⚗️ 〕",
      "│ 🧠 Estado del experimento: ESTABLE",
      "",
      `│ 🔹 Bot Principal: 1`,
      `│ 🔸 Sub-Bots: ${Math.max(0, allBots.length - 1)}`,
      `│ 🔬 Bots en este grupo: ${groupBots.length}`,
      "╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯",
      "",
      botsGroupText,
      "",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "🧪 “Con 10 mil millones de % de determinación,",
      "la ciencia siempre prevalecerá.”",
      "– Senku Ishigami 🧠"
    ].join("\n")

    // crear contacto falso con la imagen que tú configures
    let fkontak = await makeFkontak(CUSTOM_CONTACT_IMAGE_URL)
    if (!fkontak) fkontak = m // fallback

    // preparar lista de menciones bien formateadas
    const mentionList = groupBots.map(bot => bot.endsWith("@s.whatsapp.net") ? bot : `${bot}@s.whatsapp.net`)

    // enviar como mensaje "limpio" citado al contacto falso
    await conn.sendMessage(
      m.chat,
      {
        text: message,
        contextInfo: { mentionedJid: mentionList }
      },
      { quoted: fkontak }
    )

  } catch (err) {
    console.error('Error en botlist:', err)
    await conn.sendMessage(m.chat, {
      text: `💥 Error en el laboratorio. Usa ${usedPrefix}report para informar.\n\nDetalle: ${err?.message || err}`
    }, { quoted: m })
  }
}

handler.tags = ["serbot"]
handler.help = ["botlist"]
handler.command = ["botlist", "listbots", "listbot", "bots", "sockets", "socket"]

export default handler
