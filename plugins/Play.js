import fetch from "node-fetch"
import yts from "yt-search"
import fs from "fs"
import path from "path"

const TMP_DIR = path.join(process.cwd(), "tmp")

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) {
return conn.reply(
m.chat,
❌ Usa el comando así:\n\n${usedPrefix + command} nombre de la canción,
m
)
}

try {
// 📂 Crear carpeta tmp si no existe
if (!fs.existsSync(TMP_DIR)) {
fs.mkdirSync(TMP_DIR, { recursive: true })
}

// 🔍 Buscar en YouTube  
const search = await yts(text)  
if (!search.videos || search.videos.length === 0) {  
  return conn.reply(m.chat, "❌ No se encontraron resultados.", m)  
}  

// 🎵 Primer resultado  
const video = search.videos[0]  
const videoUrl = video.url  

// 📡 Llamar a la API  
const apiUrl = `https://gawrgura-api.onrender.com/download/ytmp3?url=${encodeURIComponent(text)}`  
const res = await fetch(apiUrl)  
const json = await res.json()  

if (!json.status || !json.result) {  
  return conn.reply(m.chat, "❌ Error al descargar el audio.", m)  
}  

// 🧾 Nombre del archivo  
const safeTitle = video.title.replace(/[\\/:*?"<>|]/g, "")  
const filePath = path.join(TMP_DIR, `${safeTitle}.mp3`)  

// ⬇️ Descargar el audio a tmp/  
const audioRes = await fetch(json.result)  
const buffer = await audioRes.arrayBuffer()  
fs.writeFileSync(filePath, Buffer.from(buffer))  

// ℹ️ Información  
let info = `

🎧 Reproduciendo
━━━━━━━━━━━━━━
📌 Título: ${video.title}
👤 Canal: ${video.author.name}
⏱️ Duración: ${video.timestamp}
👁️ Vistas: ${video.views.toLocaleString()}
━━━━━━━━━━━━━━
`

await conn.sendMessage(  
  m.chat,  
  {  
    image: { url: video.thumbnail },  
    caption: info.trim()  
  },  
  { quoted: m }  
)  

// 🔊 Enviar audio desde archivo local  
await conn.sendMessage(  
  m.chat,  
  {  
    audio: fs.readFileSync(filePath),  
    mimetype: "audio/mp3",  
    fileName: `${safeTitle}.mp3`  
  },  
  { quoted: m }  
)  

// 🧹 Borrar archivo después de enviar  
fs.unlinkSync(filePath)

} catch (e) {
console.error(e)
conn.reply(m.chat, "❌ Ocurrió un error inesperado.", m)
}
}

handler.help = ["play <canción>"]
handler.tags = ["descargas"]
handler.command = ["play"]

export default handler