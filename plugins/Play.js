import fetch from "node-fetch"
import yts from "yt-search"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `❌ Usa el comando así:\n\n${usedPrefix + command} nombre de la canción`,
      m
    )
  }

  try {
    // 🔍 Buscar en YouTube
    const search = await yts(text)
    if (!search.videos || search.videos.length === 0) {
      return conn.reply(m.chat, "❌ No se encontraron resultados.", m)
    }

    // 🎵 Primer resultado
    const video = search.videos[0]
    const videoUrl = video.url

    // 📡 Llamar a la API
    const apiUrl = `https://gawrgura-api.onrender.com/download/ytmp3?url=${encodeURIComponent(videoUrl)}`
    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status || !json.result) {
      return conn.reply(m.chat, "❌ Error al descargar el audio.", m)
    }

    // ℹ️ Información antes del audio
    let info = `
🎧 *Reproduciendo*
━━━━━━━━━━━━━━
📌 *Título:* ${video.title}
👤 *Canal:* ${video.author.name}
⏱️ *Duración:* ${video.timestamp}
👁️ *Vistas:* ${video.views.toLocaleString()}
━━━━━━━━━━━━━━
`

    await conn.sendMessage(
      m.chat,
      {
        image: { url: video.thumbnail },
        caption: info.trim()
      },
      { quoted: m }
    )

    // 🔊 Enviar audio
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: json.result },
        mimetype: "audio/mpeg",
        fileName: `${video.title}.mp3`
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "❌ Ocurrió un error inesperado.", m)
  }
}

handler.help = ["play <canción>"]
handler.tags = ["descargas"]
handler.command = ["play"]

export default handler
