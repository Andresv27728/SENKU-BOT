// 🧠 COMANDO: google
// ⚗️ “Con el poder de la ciencia, la información del mundo está al alcance de un clic.” — Senku Ishigami

import axios from 'axios'

const SEARCH_API_KEY = 'yVoHmx96Dt8hJqtqyDxfRqYG'

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text)
    return m.reply(`🧪 *Eureka!* Necesito saber qué deseas buscar en Google.\n\nEjemplo:\n> ${usedPrefix}google historia del fuego`)

  await m.react('🔍')

  const endpoint = `https://www.searchapi.io/api/v1/search?engine=google&q=${encodeURIComponent(text)}&api_key=${SEARCH_API_KEY}`
  let data = null
  let intento = 0
  const maxIntentos = 3

  await m.reply(`🧬 *Analizando la red mundial de datos...*\n\n🌐 Consultando Google a través del laboratorio de Senku.\n> “Cada bit de información es una molécula de conocimiento.” ⚗️`)

  while (intento < maxIntentos && !data) {
    try {
      intento++
      const res = await axios.get(endpoint, { timeout: 15000 })
      if (res.data?.organic_results?.length) {
        data = res.data.organic_results
        break
      }
    } catch (e) {
      console.log(`Intento ${intento} fallido:`, e.message)
      if (intento < maxIntentos) await new Promise(r => setTimeout(r, 3000))
    }
  }

  if (!data)
    return m.reply(`💥 *Error tras ${maxIntentos} intentos*\n────────────────────\n⚠️ No fue posible obtener resultados.\n> “Incluso la ciencia tropieza cuando no hay datos disponibles.” ⚙️`)

  const resultados = data.slice(0, 5)
  let mensaje = `🧠 *RESULTADOS CIENTÍFICOS DE GOOGLE*\n───────────────────────\n🔍 *Búsqueda:* ${text}\n📊 *Resultados obtenidos:* ${resultados.length}\n───────────────────────\n`

  for (const r of resultados) {
    mensaje += `\n🔹 *${r.title}*\n${r.snippet ? r.snippet : ''}\n🌐 ${r.link}\n`
  }

  mensaje += `\n───────────────────────\n💡 *“La curiosidad es la chispa que enciende el progreso.” — Senku Ishigami* ⚗️`

  await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m })
  await m.react('✅')
}

handler.help = ['google <texto>']
handler.tags = ['busqueda']
handler.command = ['google', 'buscar', 'g']

export default handler
