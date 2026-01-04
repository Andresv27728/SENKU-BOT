let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Falta el JID del usuario.')
  const userJid = text.trim()

  try {
    await conn.sendMessage(userJid, { text: '❌ Tu mensaje fue rechazado por el owner. No será publicado en el canal.' })
    await m.reply('🧪 Mensaje rechazado correctamente.')
  } catch (e) {
    console.error(e)
    await m.reply('⚠️ No se pudo notificar al usuario.')
  }
}

handler.command = /^nglreject$/i
handler.owner = true
export default handler
