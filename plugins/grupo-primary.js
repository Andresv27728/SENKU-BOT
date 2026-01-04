import ws from 'ws'

const handler = async (m, { conn, usedPrefix }) => {
  const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn.user.jid)])]
  if (global.conn?.user?.jid && !subBots.includes(global.conn.user.jid)) {
    subBots.push(global.conn.user.jid)
  }
  const chat = global.db.data.chats[m.chat]
  const mentionedJid = await m.mentionedJid
  const who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : false
  
  if (!who) {
    return conn.sendMessage(m.chat, { 
      text: `「✦」 CONFIGURACION DE BOT PRIMARIO\n\n> ❍ Accion » Mencione un Socket\n> ❐ Uso » Responda o mencione un usuario\n> ❀ Objetivo » Establecer Bot principal del grupo` 
    }, { quoted: m })
  }
  
  if (!subBots.includes(who)) {
    return conn.sendMessage(m.chat, { 
      text: `「☆」 USUARIO NO VALIDO\n\n> ❍ Usuario » @${who.split`@`[0]}\n> ❐ Estado » No es un Socket autorizado\n> ❀ Sistema » ${botname}`,
      mentions: [who]
    }, { quoted: m })
  }
  
  if (chat.primaryBot === who) {
    return conn.sendMessage(m.chat, { 
      text: `「❀」 CONFIGURACION ACTUAL\n\n> ❍ Usuario » @${who.split`@`[0]}\n> ❐ Estado » Ya es Bot principal\n> ❀ Grupo » Este chat actual`,
      mentions: [who]
    }, { quoted: m })
  }
  
  try {
    chat.primaryBot = who
    conn.sendMessage(m.chat, { 
      text: `「•」 BOT PRIMARIO CONFIGURADO\n\n> ❍ Socket » @${who.split`@`[0]}\n> ❐ Funcion » Bot principal del grupo\n> ❀ Nota » Todos los comandos seran ejecutados por este Socket`,
      mentions: [who]
    }, { quoted: m })
  } catch (e) {
    conn.sendMessage(m.chat, { 
      text: `「❗」 ERROR DE CONFIGURACION\n\n> ❍ Problema » Error en el sistema\n> ❐ Solucion » Use ${usedPrefix}report\n> ❀ Detalles » ${e.message}` 
    }, { quoted: m })
  }
}

handler.help = ['setprimary']
handler.tags = ['grupo']
handler.command = ['setprimary']
handler.group = true
handler.admin = true

export default handler
