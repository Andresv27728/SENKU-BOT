// COMANDO: ping
import moment from 'moment-timezone'

const DECO = ["⚡", "🔥", "💎", "⚡", "✨", "🌟", "🔮", "⚙️"]
const BORDES = [
  "━━━━━━━━━━━━━━━━━━━━━━",
  "══════════════════════",
  "▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰",
]

const deco = () => DECO[Math.floor(Math.random() * DECO.length)]
const border = () => BORDES[Math.floor(Math.random() * BORDES.length)]

let handler = async (m, { conn }) => {
  try {
    await m.react(deco())

    const botName = typeof global.botname === 'string' ? global.botname : 'SenkuBot'
    const uptimeSec = process.uptime()
    const hours = Math.floor(uptimeSec / 3600)
    const minutes = Math.floor((uptimeSec % 3600) / 60)
    const seconds = Math.floor(uptimeSec % 60)
    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`
    const now = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss')

    const txt = `
${border()}
${deco()} *⚙️ 𝗘𝗦𝗧𝗔𝗗𝗢 𝗗𝗘𝗟 𝗕𝗢𝗧 ⚙️* ${deco()}
${border()}

${deco()} *Nombre:* ${botName}
${deco()} *Tiempo activo:* ${uptimeStr}
${deco()} *Hora:* ${now}

${border()}
    `.trim()

    const buttons = [
      { buttonId: '.menu', buttonText: { displayText: `${deco()} 𝕸𝖊𝖓𝖚́` }, type: 1 },
      { buttonId: '.code', buttonText: { displayText: `${deco()} 𝕾𝖊𝖗 𝕾𝖚𝖇𝖇𝖔𝖙` }, type: 1 }
    ]

    const sentMsg = await conn.sendMessage(
      m.chat,
      {
        text: txt,
        footer: `${deco()} 𝙇𝙖𝙗𝙤𝙧𝙖𝙩𝙤𝙧𝙞𝙤 𝙙𝙚 𝙎𝙚𝙣𝙠𝙪`,
        buttons,
        headerType: 1
      },
      { quoted: m }
    )

    setTimeout(async () => {
      try {
        await conn.sendMessage(m.chat, { delete: sentMsg.key })
      } catch (e) {
        console.log('⚠️ No se pudo borrar el mensaje de ping:', e)
      }
    }, 2 * 60 * 1000)

    await m.react('✅')

  } catch (err) {
    console.error(err)
    await m.react('💥')
    conn.reply(m.chat, `${deco()} ⚠️ *Error inesperado*`, m)
  }
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping', 'p']

export default handler
