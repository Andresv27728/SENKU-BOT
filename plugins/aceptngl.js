let handler = async (m, { conn, text }) => {
  if (!text.includes('|')) return m.reply('Formato inválido. Usa el botón original.')

  const [senderJid, rawMsg] = text.split('|')
  const msg = decodeURIComponent(rawMsg)

  // 🛰️ Canal oficial donde se publicará el mensaje
  const channelJid = '120363399729727124@newsletter'

  try {
    await conn.sendMessage(channelJid, {
      text: `🧠 *Mensaje anónimo enviado por un seguidor:*\n\n${msg}`
    })

    await conn.sendMessage(senderJid, { text: '✅ Tu mensaje fue aprobado y publicado en el canal.' })
    await m.reply('📢 Mensaje publicado correctamente en el canal.')
  } catch (e) {
    console.error(e)
    await m.reply('⚠️ Error al publicar el mensaje en el canal.')
  }
}

handler.command = /^nglaccept$/i
handler.owner = true
export default handler

