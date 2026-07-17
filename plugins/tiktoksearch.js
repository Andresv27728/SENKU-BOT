import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text)
    throw `✳️ *Uso correcto:* ${usedPrefix + command} <término de búsqueda>\n\n📌 Ejemplo:\n${usedPrefix + command} funny cats`

  m.react("🔎")

  
  const BORDER_LEFT = "⚗️".repeat(3)
  const BORDER_RIGHT = "🧪".repeat(3)

  try {
    // 🔹 Llamar a la API de Gawrgura
    const res = await fetch(`https://gawrgura-api.onrender.com/search/tiktok?q=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.status || !json.result || json.result.length === 0)
      throw "⚠️ No se encontraron resultados para tu búsqueda."

    const results = json.result.slice(0, 5)

    let txt = `${BORDER_LEFT}\n`
    txt += ` *RESULTADOS DE TIKTOK PARA:* ${text} \n`
    txt += `${BORDER_RIGHT}\n\n`

    for (let [i, v] of results.entries()) {
      txt += `${BORDER_LEFT}\n`
      txt += `📌 *${i + 1}. ${v.title || "Sin título"}*\n`
      txt += `👤 Autor: ${v.author?.nickname || "Desconocido"}\n`
      txt += `🎵 Música: ${v.music_info?.title || "N/A"}\n`
      txt += `👁️‍🗨️ Vistas: ${v.play_count?.toLocaleString() || "0"}\n`
      txt += `🔗 Enlace: ${v.play || v.url}\n`
      txt += `${BORDER_RIGHT}\n\n`
    }

    txt += `${BORDER_LEFT}\n *FIN DE RESULTADOS*\n${BORDER_RIGHT}`

    // Miniatura
    let thumb = results[0]?.cover || results[0]?.origin_cover || null

    await conn.sendMessage(
      m.chat,
      {
        image: { url: thumb },
        caption: txt.trim(),
      },
      { quoted: m }
    )

    m.react("✅")

  } catch (e) {
    console.error(e)
    m.react("❌")
    m.reply("❌ Ocurrió un error al buscar en TikTok. Intenta de nuevo más tarde.")
  }
}

handler.help = ["tiktoksearch <texto>"]
handler.tags = ["busqueda", "descargas"]
handler.command = ["tiktoksearch", "ttsearch"]

export default handler
