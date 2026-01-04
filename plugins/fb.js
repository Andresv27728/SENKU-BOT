import fetch from "node-fetch";
import { fbdl } from "ruhend-scraper";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `📘 *Uso correcto:* ${usedPrefix + command} <link de Facebook>`;
  m.react("📥");

  try {
    let title = "Video de Facebook";
    let thumbnail = null;
    let videoUrl = null;

    // 🟦 MÉTODO 1: ruhend-scraper
    try {
      const res = await fbdl(text);
      const data = res.data || [];
      if (Array.isArray(data) && data.length > 0) {
        videoUrl = data[0].url || null;
      }
      console.log("✅ Método 1 (ruhend-scraper) OK");
    } catch (e) {
      console.log("❌ Método 1 falló, probando método 2...");
    }

    // 🟩 MÉTODO 2: gawrgura-api
    if (!videoUrl) {
      try {
        const res = await fetch(
          `https://gawrgura-api.onrender.com/download/facebook?url=${encodeURIComponent(text)}`
        );
        const json = await res.json();

        if (json.status && json.result?.media) {
          title = json.result?.info?.title || title;
          thumbnail = json.result?.media?.thumbnail || null;
          videoUrl = json.result?.media?.video_hd || json.result?.media?.video_sd || null;
        }
        console.log("✅ Método 2 (gawrgura-api) OK");
      } catch (e) {
        console.log("❌ Método 2 falló.");
      }
    }

    if (!videoUrl) throw "⚠️ No se pudo descargar el video con ningún método.";

    // 🖼️ Descargar miniatura si existe
    let thumbBuffer = null;
    if (thumbnail) {
      try {
        const res = await fetch(thumbnail);
        thumbBuffer = Buffer.from(await res.arrayBuffer());
      } catch {}
    }

    // 📥 Descargar video
    const vidRes = await fetch(videoUrl);
    const videoBuffer = Buffer.from(await vidRes.arrayBuffer());
    const videoSizeMB = videoBuffer.byteLength / (1024 * 1024);

    // 💾 Enviar como video o documento
    if (videoSizeMB <= 45) {
      await conn.sendMessage(m.chat, {
        video: videoBuffer,
        caption: `🎬 *${title}*\n🌐 *Fuente:* Facebook`,
        mimetype: "video/mp4",
        jpegThumbnail: thumbBuffer,
      });
    } else {
      await conn.sendMessage(m.chat, {
        document: videoBuffer,
        fileName: `${title}.mp4`,
        mimetype: "video/mp4",
        caption: `📦 *${title}*\n(Enviado como documento por tamaño grande)`,
        jpegThumbnail: thumbBuffer,
      });
    }

    m.react("✅");
  } catch (e) {
    console.error(e);
    m.react("❌");
    m.reply("❌ No se pudo descargar el video. Verifica el enlace o inténtalo más tarde.");
  }
};

handler.help = ["fb <link>", "fbdl <link>", "facebook <link>"];
handler.tags = ["descargas"];
handler.command = ["fb", "fbdl", "facebook"];
handler.register = false;

export default handler;
