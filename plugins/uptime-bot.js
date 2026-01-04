let handler = async (m, { conn }) => {

  // 🔧 CONFIGURA AQUÍ LA FECHA DE INICIO
  // FORMATO: dd/mm/aaaa hh:mm
  const START_TIME = "01/01/2026 00:00"

  // ============================= //
  const [date, time] = START_TIME.split(' ')
  const [day, month, year] = date.split('/').map(Number)
  const [hour, minute] = time.split(':').map(Number)

  const startDate = new Date(year, month - 1, day, hour, minute)
  const now = new Date()

  let diff = now - startDate
  if (diff < 0) diff = 0

  const totalMinutes = Math.floor(diff / 60000)

  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60

  const text = `┃ 🤖 *Uptime Bot:* ${days}d ${hours}h ${minutes}m`

  await conn.sendMessage(m.chat, { text }, { quoted: m })
}

handler.help = ['uptimebot']
handler.tags = ['info']
handler.command = /^uptimebot$/i

export default handler