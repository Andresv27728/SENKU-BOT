/*No tocar*/
import { delay } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  try {
    let buttons = [
      { buttonId: '.gp1', buttonText: { displayText: '🔓 Abrir Grupo ' }, type: 1 },
      { buttonId: '.gp0', buttonText: { displayText: '🔒 Cerrar Grupo ' }, type: 1 }
    ]

    // 🧩 Borde seguro: corto y consistente (mismo patrón a ambos lados)
    const LEFT = "🔬🧪⚗️";   // borde izquierdo (puedes cambiar los 3 emojis por otros)
    const RIGHT = "🔬🧪⚗️";  // borde derecho

    // ✅ Construimos líneas y las decoramos con el borde de forma segura
    const lines = [
      `${LEFT}   CONTROL DEL GRUPO ${RIGHT}`,
      `${LEFT}  ➤ 🔓 Abrir Grupo: Todos pueden enviar mensajes. ${RIGHT}`,
      `${LEFT}  ➤ 🔒 Cerrar Grupo: Solo admins pueden enviar.   ${RIGHT}`,
      `${LEFT}  ¡Administra tu grupo!   ${RIGHT}`
    ]

    // Unimos con saltos de línea (líneas cortas => no desordenan)
    const panelText = lines.join('\n')

    // Enviamos el panel con botones (todo igual a como antes)
    const msg = await conn.sendMessage(
      m.chat,
      {
        text: panelText,
        buttons,
        headerType: 1
      },
      { quoted: m }
    )

    // Autodestrucción (igual que antes)
    await delay(120000)
    try { await conn.sendMessage(m.chat, { delete: msg.key }) } catch (e) { /* no bloquear */ }

  } catch (e) {
    console.error(e)
    m.reply('💥 Error en el panel.')
  }
}

handler.help = ['grupo']
handler.tags = ['grupo']
handler.command = ['grupo']
handler.admin = true
handler.group = true

export default handler
