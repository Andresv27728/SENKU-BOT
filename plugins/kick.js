import { areJidsSameUser } from '@whiskeysockets/baileys'

let handler = async (m, { conn, participants }) => {
  try {
    // 🧠 Detección universal de usuario mencionado o citado
    let user =
      (m.mentionedJid && m.mentionedJid[0]) ||
      (m.msg && m.msg.contextInfo && m.msg.contextInfo.mentionedJid && m.msg.contextInfo.mentionedJid[0]) ||
      (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) ||
      (m.quoted && m.quoted.sender) ||
      null

    if (!user) {
      return conn.reply(
        m.chat,
        `🧪 *¿A quién quieres que expulse?*  
No has mencionado ni respondido a nadie...  
La ciencia no puede ayudarte si no sabes a quién eliminar. ⚗️`,
        m
      )
    }

    const metadata = await conn.groupMetadata(m.chat)
    const groupOwner = metadata.owner || (m.chat.split('-')[0] + '@s.whatsapp.net')
    const botJid = conn.user.jid
    const ownerBot = (global.owner?.[0] || '').replace(/[^0-9]/g, '') + '@s.whatsapp.net'

    // 🧬 Protecciones científicas
    if (areJidsSameUser(user, botJid)) {
      return conn.reply(
        m.chat,
        `🤓 ¿Quieres que me saque a mí mismo?  
Eso sería... *cero lógico.*`,
        m
      )
    }

    if (areJidsSameUser(user, groupOwner)) {
      return conn.reply(
        m.chat,
        `👑 Ese es el líder del grupo.  
Ni la ciencia puede alterar la jerarquía natural.`,
        m
      )
    }

    if (areJidsSameUser(user, ownerBot)) {
      return conn.reply(
        m.chat,
        `🧠 Ese es mi creador, el Einstein de este laboratorio.  
No pienso tocarlo.`,
        m
      )
    }

    // 🧪 Verificar si el usuario está en el grupo
    const member = metadata.participants.find(p => areJidsSameUser(p.id, user))
    if (!member) {
      return conn.reply(
        m.chat,
        `❌ Esa persona ni siquiera está en este grupo experimental.`,
        m
      )
    }

    // ⚗️ Ejecutar la expulsión
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')

    await conn.reply(
      m.chat,
      `💥 *Expulsión completada.*  
Senku ha aplicado la ley de la ciencia:  
*"La incompetencia se elimina del grupo."* 🧬  

👋 Adiós, @${user.split('@')[0]}!`,
      m,
      { mentions: [user] }
    )
  } catch (e) {
    console.error(e)
    conn.reply(
      m.chat,
      `❌ No pude eliminarlo...  
Tal vez mis permisos no están optimizados. 😤`,
      m
    )
  }
}

// 🧩 Información del comando
handler.help = ['kick @usuario']
handler.tags = ['grupo']
handler.command = ['kick', 'echar', 'sacar', 'ban']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
