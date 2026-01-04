// 🧪 COMANDO: hidetag
// 👨‍🔬 Inspirado en Senku Ishigami — "¡La ciencia del silencio también tiene poder!" ⚗️

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => u.id)
    const quoted = m.quoted ? m.quoted : null

    if (quoted) {
      // 🔹 Reenvía el mensaje citado con mención oculta
      await conn.sendMessage(m.chat, { 
        forward: quoted, 
        mentions: users 
      }, { quoted: m })
    } else if (text) {
      // 🔹 Envía mensaje de texto con mención oculta
      await conn.sendMessage(m.chat, { 
        text: `🧬 *Transmisión silenciosa de Senku* ⚗️\n\n${text}`, 
        mentions: users 
      }, { quoted: m })
    } else {
      return m.reply(`⚠️ *Ecuación incompleta.*\nDebes responder a un mensaje o escribir algo.\n\nEjemplo:\n> .hidetag hola`)
    }

    await m.react('🧪')
  } catch (e) {
    console.error(e)
    await m.reply('💥 Error al ejecutar la fórmula de mención oculta.')
  }
}

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['hidetag','n']
handler.group = true
handler.admin = true

export default handler
