let handler = async (m, { conn }) => {
  if (!m.isGroup) return

  try {
    await conn.groupSettingUpdate(m.chat, 'announcement')
    await conn.sendMessage(m.chat, {
      text: '🔒 *Grupo cerrado con éxito.*\n> “Incluso la ciencia necesita silencio para pensar.” — *Senku Ishigami* ⚙️'
    })
  } catch {
    await m.reply('💥 No se pudo cerrar el grupo. Verifica si el bot tiene permisos de administrador.')
  }
}

handler.command = ['gp0']
handler.admin = true
handler.group = true

export default handler
