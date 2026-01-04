let handler = async (m, { conn, args, text, command }) => {
  // Solo para el dueño del bot
  if (!global.owner.includes(m.sender.split('@')[0])) {
    return m.reply('🧠 *Acceso denegado.* Solo Senku (el propietario) puede ejecutar este comando.')
  }

  const groupId = m.chat

  // Verifica que el comando se use en un grupo
  if (!m.isGroup) {
    return m.reply('⚗️ Usa este comando dentro de un grupo para salir de él.')
  }

  try {
    await m.react('🧪')
    await conn.sendMessage(groupId, {
      text: `
╭━━━━━━━『 ⚙️ 𝗦𝗘𝗡𝗞𝗨 𝗕𝗢𝗧 𝗦𝗔𝗟𝗜𝗘𝗡𝗗𝗢 🔬 』━━━━━━━╮
┃ 💬 Grupo: *${m.chat.split('@')[0]}*
┃ 👨‍🔬 Acción: *Salida científica activada*
┃ 🧠 Motivo: *${text || 'Orden directa del creador'}*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
“¡La ciencia avanza, aunque el grupo quede atrás!” 🧪
`.trim()
    })

    await m.react('✅')

    // Sale del grupo después de un pequeño delay
    setTimeout(async () => {
      await conn.groupLeave(groupId)
    }, 2500)

  } catch (e) {
    console.log(e)
    await m.react('⚠️')
    return m.reply('💥 *Error científico:* No pude salir del grupo. Verifica permisos.')
  }
}

handler.help = ['leave', 'salir']
handler.tags = ['owner', 'grupo']
handler.command = /^(leave|salir)$/i
handler.rowner = true

export default handler
