import fetch from "node-fetch"
import yts from "yt-search"
import fs from "fs"
import path from "path"

const TMP_DIR = path.join(process.cwd(), "tmp")

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `Usa el comando así:\n\n${usedPrefix + command} nombre de la canción`,
      m
    )
  }

  try {
    // Crear carpeta tmp
    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR, { recursive: true })
    }

    // Buscar en YouTube
    const search = await yts(text)
    if (!search.videos?.length) {
      return conn.reply(m.chat, "No se encontraron resultados.", m)
    }

    const video = search.videos[0]
    const videoUrl = video.url

    // Llamar API
    const apiUrl =
      "https://gawrgura-api.onrender.com/download/ytmp3?url=" +
      encodeURIComponent(videoUrl)

    const res = await fetch(apiUrl, {
      headers: {
        "user-agent": "Mozilla/5.0",
        "accept": "application/json"
      }
    })

    if (!res.ok) {
      throw new Error(`API error ${res.status}`)
    }

    const json = await res.json()

    if (!json.status || !json.result) {
      return conn.reply(m.chat, "Error al convertir el audio.", m)
    }

    const safeTitle = video.title.replace(/[\\/:*?"<>|]/g, "")
    const filePath = path.join(TMP_DIR, `${safeTitle}.mp3`)

    // Descargar MP3
    const audioRes = await fetch(json.result, {
      headers: { "user-agent": "Mozilla/5.0" }
    })

    if (!audioRes.ok) {
      throw new Error("Error descargando el audio")
    }

    const buffer = Buffer.from(await audioRes.arrayBuffer())
    fs.writeFileSync(filePath, buffer)

    // Info
    const info = `
Reproduciendo
────────────
Título: ${video.title}
Canal: ${video.author.name}
Duración: ${video.timestamp}
Vistas: ${video.views.toLocaleString()}
────────────
`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: video.thumbnail },
        caption: info
      },
      { quoted: m }
    )

    // Enviar audio
    await conn.sendMessage(
      m.chat,
      {
        audio: fs.readFileSync(filePath),
        mimetype: "audio/mpeg",
        fileName: `${safeTitle}.mp3`,
        ptt: false
      },
      { quoted: m }
    )

    fs.unlinkSync(filePath)

  } catch (err) {
    console.error(err)
    conn.reply(m.chat, "Ocurrió un error al procesar el audio.", m)
  }
}

handler.help = ["play <canción>"]
handler.tags = ["descargas"]
handler.command = ["play"]

export default handler