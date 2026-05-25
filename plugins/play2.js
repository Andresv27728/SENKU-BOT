import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `「✦」Escribe el nombre o link del video.\n> ✐ Ejemplo » *${usedPrefix + command} lovely*`

  await m.react('🕒')

  try {
    const apiUrl = `https://yosoyyo-api-ofc.onrender.com/api/youtube?q=${encodeURIComponent(text)}&apiKey=${global.api}`
    const response = await fetch(apiUrl)
    const json = await response.json()

    if (!json.result || json.result.length === 0) {
      throw '「✦」No se encontraron resultados.'
    }

    const video = json.result[0]
    const { title, videoUrl, thumbnailUrl, channelName, duration, download } = video
    const mp4Url = download.mp4

    const caption = `🎞️ *Reproduciendo Video*
━━━━━━━━━━━━━━
📌 *Título:* ${title}
👤 *Canal:* ${channelName}
⏱️ *Duración:* ${duration}
🔗 *Link:* ${videoUrl}
━━━━━━━━━━━━━━`

    await conn.sendMessage(m.chat, {
      image: { url: thumbnailUrl || 'https://i.ytimg.com/vi/error/hqdefault.jpg' },
      caption
    }, { quoted: m })

    if (mp4Url) {
      await conn.sendMessage(m.chat, {
        video: { url: mp4Url },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        caption: `🎬 ${title}`
      }, { quoted: m })
      await m.react('✅')
    } else {
      throw '「✦」No se pudo obtener el enlace de descarga MP4.'
    }

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply(`「✦」Ocurrió un error inesperado.\n\n> 🧩 Error:\n\`\`\`\n${e.message || e}\n\`\`\``)
  }
}

handler.help = ['play2 <texto|link>']
handler.tags = ['multimedia']
handler.command = ['play2']

export default handler
