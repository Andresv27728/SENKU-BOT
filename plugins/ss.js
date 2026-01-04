import fetch from "node-fetch";

let handler = async (m, { text, conn }) => {
  if (!text) return m.reply("🌐 *Debes ingresar una URL.*\n\nEjemplo: .ss https://www.google.com");

  try {
    // 🧠 Asegurar que la URL tenga protocolo
    let url = text.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    // 📡 Llamar a la API
    const api = `https://gawrgura-api.onrender.com/tools/ssweb?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    const data = await res.json();

    if (!data.status || !data.result) return m.reply("⚠️ No se pudo generar la captura.");

    const img = data.result.iurl;
    if (!img) return m.reply("❌ No se encontró imagen válida en la respuesta.");

    // 🖼️ Enviar captura al chat
    await conn.sendMessage(m.chat, { image: { url: img }, caption: `🖥️ *Captura de:* ${data.result.ourl}` }, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply("❌ Ocurrió un error al generar la captura de pantalla.");
  }
};

handler.help = ["ss <url>"];
handler.tags = ["tools"];
handler.command = /^ss$/i;

export default handler;
