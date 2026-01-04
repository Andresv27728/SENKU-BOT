// 🎄❄️ COMANDO TIKTOK NAVIDEÑO ❄️🎄
import { ttdl } from 'ruhend-scraper'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) 
    return conn.reply(m.chat, '🎅✨ *Debes ingresar un enlace válido de TikTok.*\nEjemplo:\n' + usedPrefix + command + ' https://tiktok.com/xxx', m)

  await m.react('🎁')

  try {
    let {
      title, author, username, published,
      like, comment, share, views,
      bookmark, video, cover, duration,
      music, profilePicture
    } = await ttdl(args[0])

    // Bordes navideños seguros y limpios
    const L = "🎄✨"
    const R = "✨🎁"

    let txt = `
${L} 🎅 *DESCARGA DE TIKTOK* 🎅 ${R}
${L} 📌 *Título:* ${title || '-'} ${R}
${L} 👤 *Autor:* ${author || '-'} ${R}
${L} ⏱️ *Duración:* ${duration || '-'} ${R}
${L} 👀 *Vistas:* ${views || '-'} ${R}
${L} ❤️ *Likes:* ${like || '-'} ${R}
${L} 💬 *Comentarios:* ${comment || '-'} ${R}
${L} 📅 *Publicado:* ${published || '-'} ${R}
${L} 🔔 *Descargando video…* ${R}
`.trim()

    await conn.sendFile(m.chat, video, 'Tiktokdl.mp4', txt, m)
    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply("❌🎄 *No se pudo descargar el video. Revisa el enlace e intenta nuevamente.*")
  }
}

handler.help = ['tiktok']
handler.tags = ['descargas']
handler.command = ['tiktok', 'tt']

export default handler
