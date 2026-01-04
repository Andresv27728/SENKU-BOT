let handler = async (m, { conn }) => {
  try {
    // 🔹 Datos oficiales
    global.namecanal = 'YO SOY YO'
    global.canal = 'https://whatsapp.com/channel/0029VbAmMiM96H4KgBHZUn1z'
    global.idcanal = '120363399729727124@newsletter'
    global.ownername = 'YO SOY YO'
    global.ownernum = '573133374132'
    global.grupoofc = 'https://chat.whatsapp.com/DZfx8mdUZ154oZSr27iXDj'
    global.comunidadofc = 'https://chat.whatsapp.com/HAkWFmX6XnCEBpZMUwymSj'

    let info = `
╭─⬣「 *INFORMACIÓN OFICIAL* 」⬣
│ 📢 *Canal:* ${global.namecanal}
│ 🔗 ${global.canal}
│ 👑 *Owner:* ${global.ownername}
│ 📞 *Número:* wa.me/${global.ownernum}
│ 👥 *Grupo Oficial:* ${global.grupoofc}
│ 🌐 *Comunidad Oficial:* ${global.comunidadofc}
╰───────────────────⬣`

    await conn.sendMessage(m.chat, { text: info }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply('⚠️ Error al mostrar la información oficial.')
  }
}

handler.command = /^(info|oficial|canal|owner|creador)$/i
export default handler
