let handler = async (m, { conn }) => {
  if (!m.isGroup) return

  try {
    await conn.groupSettingUpdate(m.chat, 'not_announcement')
    await conn.sendMessage(m.chat, {
      text: '🧪 *Grupo abierto exitosamente.*\n> “La comunicación es el oxígeno de la ciencia.” — *Senku Ishigami* ⚗️'
    })
  } catch {
    await m.reply('💥 No se pudo abrir el grupo. Verifica si el bot tiene permisos de administrador.')
  }
}

handler.command = ['gp1']
handler.admin = true
handler.group = true

export default handler
