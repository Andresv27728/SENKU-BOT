import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🎵 *Uso correcto:* ${usedPrefix + command} <nombre de la canción o parte de la letra>`;
  m.react("🎶");

  try {
    // 🔹 Solicitud a la API
    const res = await fetch(`https://gawrgura-api.onrender.com/search/lyrics?q=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.result) throw "⚠️ No se encontró la letra de esa canción.";

    // 📝 Formatear el texto de la letra
    const lyric = json.result
      .replace(/\n{2,}/g, "\n") // limpia saltos dobles
      .replace(/\s{2,}/g, " ")  // limpia espacios dobles

    // 🎤 Enviar resultado
    await conn.sendMessage(m.chat, {
      text: `🎵 *Letra encontrada*\n\n📖 *Búsqueda:* ${text}\n\n${lyric}`,
    }, { quoted: m });

    m.react("✅");

  } catch (e) {
    console.error(e);
    m.react("❌");
    m.reply("❌ No se pudo obtener la letra. Intenta con otro nombre o más específico.");
  }
};

handler.help = ["lyric <nombre>", "letra <nombre>"];
handler.tags = ["busqueda"];
handler.command = ["lyric", "letra"];
handler.register = false;

export default handler;
