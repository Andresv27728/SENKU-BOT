import fetch from "node-fetch";

let handler = async (m, { text, conn }) => {
  if (!text) return m.reply("💬 *Escribe el texto que quieres convertir a voz.*\n\nEjemplo: .tts Hola, soy el bot de Gura~");

  try {
    const api = `https://gawrgura-api.onrender.com/tools/text-to-speech?text=${encodeURIComponent(text)}`;
    const res = await fetch(api);
    const data = await res.json();

    if (!data.status || !data.result) return m.reply("⚠️ No se pudo generar el audio.");

    // 🔹 Filtrar voces con enlaces válidos
    let voices = data.result.filter(v => {
      const keys = Object.keys(v);
      return keys.some(k => typeof v[k] === "string" && v[k].includes("https"));
    });

    if (voices.length === 0) return m.reply("⚠️ No se encontraron voces disponibles en este momento.");

    // 🔹 Mezclar el orden de las voces (para aleatoriedad)
    voices = voices.sort(() => Math.random() - 0.5);

    let success = false;

    // 🔁 Intentar con varias voces hasta que funcione una
    for (const voice of voices) {
      const url = Object.values(voice).find(v => typeof v === "string" && v.includes("https"));
      if (!url) continue;

      try {
        const check = await fetch(url, { method: "HEAD" });
        if (check.ok) {
          await conn.sendMessage(m.chat, { audio: { url }, mimetype: "audio/mpeg", ptt: false }, { quoted: m });
          success = true;
          break;
        }
      } catch {
        continue; // Si falla una voz, prueba la siguiente
      }
    }

    if (!success) m.reply("❌ Ninguna de las voces funcionó, intenta nuevamente.");

  } catch (error) {
    console.error(error);
    m.reply("❌ Ocurrió un error al generar el TTS.");
  }
};

handler.help = ["tts <texto>"];
handler.tags = ["tools"];
handler.command = /^tts$/i;

export default handler;
