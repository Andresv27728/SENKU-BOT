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
    const mp3Url = download.mp3

    const caption = `🎧 *Reproduciendo*
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

    if (mp3Url) {
      await conn.sendMessage(m.chat, {
        audio: { url: mp3Url },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: m })
      await m.react('✅')
    } else {
      throw '「✦」No se pudo obtener el enlace de descarga MP3.'
    }

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply(`「✦」Ocurrió un error inesperado.\n\n> 🧩 Error:\n\`\`\`\n${e.message || e}\n\`\`\``)
  }
}

handler.help = ['play <texto|link>']
handler.tags = ['multimedia']
handler.command = ['play']

export default handler
