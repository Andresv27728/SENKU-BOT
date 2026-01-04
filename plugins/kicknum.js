let handler = async (m, { conn, args, participants }) => {
  // Solo admins o el owner del bot
  if (!m.isGroup) return m.reply('⚗️ *Este comando solo funciona en grupos, mi joven científico.*')
  if (!args[0]) return m.reply('🧠 *Debes especificar el prefijo numérico.*\nEjemplo: `.kicknum 91`')
  if (!m.isAdmin && !global.owner.includes(m.sender.split('@')[0])) {
    return m.reply('🧪 *Solo los administradores o el creador pueden usar este comando.*')
  }

  const prefijo = args[0].replace(/[^0-9]/g, '')
  const groupMetadata = await conn.groupMetadata(m.chat)
  const miembros = groupMetadata.participants.map(p => p.id)
  const objetivo = miembros.filter(id => id.startsWith(prefijo) || id.replace('@s.whatsapp.net', '').startsWith(prefijo))

  if (!objetivo.length) {
    return m.reply(`🧠 *No se encontró ningún miembro con el prefijo +${prefijo}.*`)
  }

  await m.react('⚙️')
  await conn.sendMessage(m.chat, {
    text: `
╭━━━━━━━『 ⚙️ 𝗦𝗘𝗡𝗞𝗨 𝗢𝗣𝗘𝗥𝗔𝗖𝗜𝗢́𝗡 𝗞𝗜𝗖𝗞 』━━━━━━━╮
┃ 🔬 Prefijo detectado: *+${prefijo}*
┃ 👨‍🔬 Miembros afectados: *${objetivo.length}*
┃ ⚔️ Acción: *Eliminación científica iniciada...*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
“¡Por la ciencia y el orden del grupo!” 🧪
`.trim()
  }, { quoted: m })

  // Expulsar con un pequeño delay entre cada acción
  for (const user of objetivo) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
      await new Promise(res => setTimeout(res, 800)) // 0.8s entre expulsiones
    } catch (e) {
      console.error('Error expulsando a', user, e)
    }
  }

  await m.react('✅')
  await conn.sendMessage(m.chat, {
    text: `✅ *Operación completada.*\n🧠 *Senku ha restablecido el equilibrio del grupo.*`
  })
}

handler.help = ['kicknum <prefijo>']
handler.tags = ['grupo']
handler.command = /^kicknum$/i
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler
