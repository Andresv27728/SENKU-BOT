import { execSync } from 'child_process'

let handler = async (m, { conn, text }) => {
  // Reacción inicial
  await m.react('🧠')

  // 🔬 Decoraciones y frases temáticas
  const decoraciones = [
    ['⚗️', '🧪', '🧬', '🔬', '💡', '🔭', '⚛️', '📡'],
    ['💠', '🔹', '🪐', '✨', '💫', '🛸', '🧠', '🧲'],
    ['💻', '🔧', '🧯', '🧰', '💾', '📀', '🔋', '🧮'],
    ['🌌', '🚀', '🪐', '🛰️', '🌠', '☄️', '💫', '🌟']
  ]
  const deco = decoraciones[Math.floor(Math.random() * decoraciones.length)]
  const [d1, d2, d3, d4, d5, d6, d7, d8] = deco

  const frases = [
    '“La ciencia avanza incluso cuando dormimos.”',
    '“10 mil millones por ciento de eficiencia.”',
    '“El progreso no espera a los perezosos.”',
    '“Cada actualización es un paso hacia la perfección.”'
  ]
  const frase = frases[Math.floor(Math.random() * frases.length)]

  const inicio = [
    `${d1}${d2}${d3} *LABORATORIO DE SENKU – ACTUALIZACIÓN EN CURSO* ${d4}${d5}${d6}`,
    `${d7} Iniciando protocolo científico... ${d8}`,
    `⚙️ ${frase}`,
    `\n🧩 Ejecutando comando *git pull*...\n`
  ].join('\n')

  await conn.reply(m.chat, inicio, m)

  try {
    // Ejecutar git pull
    const stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''))
    const salida = stdout.toString()

    const exito = [
      `${d1}${d2}${d3} *ACTUALIZACIÓN COMPLETADA CON ÉXITO* ${d4}${d5}${d6}`,
      `🧠 Los cambios fueron integrados al sistema.`,
      `📡 Resultado científico:\n\n\`\`\`${salida}\`\`\``,
      `${d7} Sistema estable al 10 mil millones por ciento. ${d8}`
    ].join('\n')

    await conn.reply(m.chat, exito, m)
    await m.react('✅')
  } catch (e) {
    const errorMsg = [
      `${d1}${d2}${d3} *ERROR EN EL EXPERIMENTO* ${d4}${d5}${d6}`,
      `❌ Hubo un fallo al ejecutar *git pull*.`,
      `🧪 Detalle técnico:\n\n\`\`\`${e.toString()}\`\`\``,
      `${d7} Senku intentará resolverlo manualmente... ${d8}`
    ].join('\n')

    await conn.reply(m.chat, errorMsg, m)
    await m.react('⚠️')
  }
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'actualizar', 'fix']
handler.rowner = false

export default handler
