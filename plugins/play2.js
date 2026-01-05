import fetch from "node-fetch"
import yts from "yt-search"
import { ytmp4 } from "ruhend-scraper"

// ====================== 🎄 DECORACIONES RANDOM 🎄 ======================= //
const christmasBorders = [
"🎄✨❄️✨🎄","☃️🎁✨🎄✨🎁☃️","🎅🏻🎄🌟🎄🎅🏻","❄️🔔🎄🔔❄️","🎁✨☃️✨🎁",
"🎄🎀✨🎀🎄","🎅✨🎄✨🎅","❄️☃️🎄☃️❄️","🔔🎄⭐🎄🔔","🎁🎄🎅🏻🎄🎁"
]

const B = () => christmasBorders[Math.floor(Math.random() * christmasBorders.length)]
// ====================================================================== //

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `${B()}\n🎬 *Uso:* ${usedPrefix + command} <nombre o link>\n${B()}`
  m.react('🎥')

  try {
    const isUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(text)
    let videoUrl = text
    let title = "Video desconocido"
    let author = "YouTube"
    let thumbnail = null
    let finalUrl = null

    // 🔍 Buscar si no es URL
    if (!isUrl) {
      const search = await yts(text)
      const video = search.videos[0]
      if (!video) throw "❌ No se encontró el video"
      videoUrl = video.url
      title = video.title
      author = video.author?.name || "Desconocido"
      thumbnail = video.thumbnail
    }

    // 🎯 MÉTODO 1 — API ZELAPI (PRINCIPAL)
    try {
      const query = encodeURIComponent(videoUrl)
      const res = await fetch(
        `https://zelapioffciall.koyeb.app/download/youtube?url=${query}`
      )
      const json = await res.json()

      if (json.status && json.video?.length) {
        title = json.meta?.title || title
        thumbnail = json.meta?.thumbnail || thumbnail

        // Prioridad de calidad
        const qualities = ["1080p", "720p", "480p", "360p", "240p", "144p"]
        for (const q of qualities) {
          const v = json.video.find(v => v.quality === q && v.format === "mp4")
          if (v) {
            finalUrl = v.download
            break
          }
        }
      }
    } catch {}

    // 🧯 MÉTODO 2 — RESPALDO ruhend-scraper
    if (!finalUrl) {
      try {
        const data = await ytmp4(videoUrl)
        finalUrl = data?.video || data?.mp4
        title = data?.title || title
        thumbnail = data?.thumbnail || thumbnail
      } catch {}
    }

    if (!finalUrl) throw "❌ No se pudo obtener el video"

    // 📄 Info
    await conn.sendMessage(m.chat, {
      text: `${B()}\n🎬 *${title}*\n📺 YouTube\n${B()}`
    })

    // ⬇️ Descargar
    const res = await fetch(finalUrl)
    if (!res.ok) throw "❌ Error al descargar"
    const buffer = Buffer.from(await res.arrayBuffer())
    const sizeMB = buffer.byteLength / (1024 * 1024)

    // 📤 Envío
    if (sizeMB <= 45) {
      await conn.sendMessage(m.chat, {
        video: buffer,
        caption: `🎞️ ${title}`,
        mimetype: "video/mp4"
      })
    } else {
      await conn.sendMessage(m.chat, {
        document: buffer,
        fileName: sanitizeFilename(`${title}.mp4`),
        mimetype: "video/mp4",
        caption: `📦 ${title} (Documento)`
      })
    }

    m.react('✅')
  } catch (e) {
    console.error(e)
    m.react('❌')
    m.reply(`${B()}\n❌ Falló el proceso\n${B()}`)
  }
}

// 🧼 Limpiar nombre
function sanitizeFilename(name) {
  return name.replace(/[\\/:"*?<>|]+/g, "").substring(0, 80)
}

handler.help = ["play2 <video>"]
handler.tags = ["descargas"]
handler.command = ["play2"]

export default handler