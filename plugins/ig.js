import fetch from "node-fetch"
import { igdl } from "ruhend-scraper"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `📸 *Uso correcto:* ${usedPrefix + command} <enlace o usuario de Instagram>\n\nEjemplos:\n${usedPrefix + command} https://www.instagram.com/reel/xxxxxx/\n${usedPrefix + command} username`

  m.react('⏳')
  try {
    const isUrl = /^(https?:\/\/)?(www\.)?instagram\.com\//i.test(text)
    const query = text.trim()

    // ===========================
    // 🔹 MODO 1: POST, REEL, FOTO
    // ===========================
    if (isUrl) {
      const res = await igdl(query)
      const data = res.data || []
      if (!data.length) throw "⚠️ No se encontraron archivos multimedia en este enlace."

      m.reply(`📥 *Descargando ${data.length} archivo(s) de Instagram...*`)
      console.log(`✅ Descargando ${data.length} medios desde publicación.`)

      for (const [i, media] of data.entries()) {
        const fileUrl = media.url
        if (!fileUrl) continue

        await new Promise(resolve => setTimeout(resolve, 2000))

        const mediaRes = await fetch(fileUrl)
        const buffer = Buffer.from(await mediaRes.arrayBuffer())
        const sizeMB = buffer.byteLength / (1024 * 1024)

        const isImage = /\.(jpg|jpeg|png|webp)$/i.test(fileUrl)
        if (isImage) {
          if (sizeMB <= 45) {
            await conn.sendMessage(m.chat, {
              image: buffer,
              caption: `📸 Imagen ${i + 1}/${data.length}`,
            })
          } else {
            await conn.sendMessage(m.chat, {
              document: buffer,
              fileName: `instagram_${i + 1}.jpg`,
              mimetype: "image/jpeg",
              caption: `📦 Imagen ${i + 1}/${data.length} (enviada como documento)`,
            })
          }
        } else {
          if (sizeMB <= 45) {
            await conn.sendMessage(m.chat, {
              video: buffer,
              caption: `🎥 Video ${i + 1}/${data.length}`,
              mimetype: "video/mp4",
            })
          } else {
            await conn.sendMessage(m.chat, {
              document: buffer,
              fileName: `instagram_${i + 1}.mp4`,
              mimetype: "video/mp4",
              caption: `📦 Video ${i + 1}/${data.length} (enviado como documento)`,
            })
          }
        }
      }

      m.react('✅')
      return
    }

    // ===========================
    // 🔹 MODO 2: HISTORIAS (STORIES)
    // ===========================
    m.reply(`📲 Buscando historias de *${query}*...`)

    try {
      const res = await fetch(`https://gawrgura-api.onrender.com/download/igstory?username=${encodeURIComponent(query)}`)
      const json = await res.json()

      if (!json.status || !json.result?.length) throw "⚠️ No se encontraron historias activas en este usuario."

      const stories = json.result
      m.reply(`📥 *Descargando ${stories.length} historia(s) de @${query}...*`)

      for (const [i, story] of stories.entries()) {
        const storyUrl = story.url
        if (!storyUrl) continue

        await new Promise(resolve => setTimeout(resolve, 2000))

        const mediaRes = await fetch(storyUrl)
        const buffer = Buffer.from(await mediaRes.arrayBuffer())
        const sizeMB = buffer.byteLength / (1024 * 1024)

        const isImage = /\.(jpg|jpeg|png|webp)$/i.test(storyUrl)
        if (isImage) {
          if (sizeMB <= 45) {
            await conn.sendMessage(m.chat, {
              image: buffer,
              caption: `📸 Historia ${i + 1}/${stories.length}`,
            })
          } else {
            await conn.sendMessage(m.chat, {
              document: buffer,
              fileName: `story_${i + 1}.jpg`,
              mimetype: "image/jpeg",
              caption: `📦 Historia ${i + 1}/${stories.length} (enviada como documento)`,
            })
          }
        } else {
          if (sizeMB <= 45) {
            await conn.sendMessage(m.chat, {
              video: buffer,
              caption: `🎥 Historia ${i + 1}/${stories.length}`,
              mimetype: "video/mp4",
            })
          } else {
            await conn.sendMessage(m.chat, {
              document: buffer,
              fileName: `story_${i + 1}.mp4`,
              mimetype: "video/mp4",
              caption: `📦 Historia ${i + 1}/${stories.length} (enviada como documento)`,
            })
          }
        }
      }

      m.react('✅')
    } catch (err) {
      console.log("❌ Error al descargar historias:", err)
      throw "⚠️ No se pudieron obtener las historias o el usuario no tiene historias públicas."
    }

  } catch (err) {
    console.error(err)
    m.react('❌')
    m.reply("❌ Ocurrió un error al procesar el enlace o usuario de Instagram.")
  }
}

handler.help = ["ig <enlace|usuario>", "instagram <enlace|usuario>"]
handler.tags = ["descargas"]
handler.command = ["ig", "instagram"]
handler.register = false

export default handler
