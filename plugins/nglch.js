let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`
🧪 *Uso:* .nglch <mensaje>
💬 *Ejemplo:* .nglch Me gustaría que publiques esto en el canal.
`.trim())
  }

  // Número del owner principal
  const ownerNumber = (global.owner && global.owner[0]) ? global.owner[0].replace(/\D/g, '') : null
  if (!ownerNumber) return m.reply('⚠️ No hay owner configurado en global.owner')

  const ownerJid = ownerNumber + '@s.whatsapp.net'
  const senderJid = m.sender
  const senderNumber = senderJid.split('@')[0]
  const userMsg = text.trim()

  // 🧩 mensaje que ve el owner con botones
  const approvalMsg = `
╭━━━ 『 💬 NUEVO NGL PARA CANAL 』━━━╮
┃ 👤 *De:* +${senderNumber}
┃ 🆔 *JID:* ${senderJid}
┃ 🧾 *Mensaje:*
┃ ${userMsg}
╰━━━━━━━━━━━━━━━━━━━━━━╯
🧠 ¿Deseas publicarlo en el canal?
`

  const msg = await conn.sendMessage(ownerJid, {
    text: approvalMsg,
    footer: 'Senku Verification System',
    buttons: [
      { buttonId: `.nglaccept ${senderJid}|${encodeURIComponent(userMsg)}`, buttonText: { displayText: '✅ Aceptar' }, type: 1 },
      { buttonId: `.nglreject ${senderJid}`, buttonText: { displayText: '❌ Rechazar' }, type: 1 }
    ],
    headerType: 1,
    mentions: [senderJid]
  })

  await conn.sendMessage(m.chat, { text: '📨 Tu mensaje fue enviado al owner para revisión.' }, { quoted: m })
  try { await m.react('🧠') } catch {}
}

handler.help = ['nglch <texto>']
handler.tags = ['ngl']
handler.command = /^nglch$/i
export default handler
