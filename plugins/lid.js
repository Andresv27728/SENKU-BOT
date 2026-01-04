import fetch from 'node-fetch' // Asegúrate de tener instalado node-fetch

let handler = async function (m, { conn, groupMetadata }) {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos científicos.')

  const participantes = groupMetadata?.participants || []

  // 🌌 Base de decoraciones dinámicas
  const decoraciones = [
    ['⚗️', '🧪', '🧬', '🔬', '💡', '🔭', '⚛️', '📡'],
    ['💠', '🔹', '🪐', '✨', '💫', '🛸', '🧠', '🧲'],
    ['🔥', '💧', '🌿', '⚡', '🌪️', '🪨', '🌞', '🌙'],
    ['💻', '🔧', '🧯', '🧰', '🪫', '🔋', '💾', '📀'],
    ['🔮', '🕯️', '🌕', '🪄', '🌙', '⭐', '💫', '✨'],
    ['⚙️', '🔩', '🔧', '⚒️', '🪛', '🧰', '🔨', '🧲'],
    ['🌌', '🚀', '🪐', '🛰️', '🌠', '☄️', '💫', '🌟'],
    ['💾', '📡', '🧠', '🔭', '🧮', '💻', '🔋', '📘'],
    ['═', '║', '╔', '╗', '╚', '╝', '╠', '╣'],
    ['⚗️', '🧴', '🧫', '💧', '🌡️', '🧯', '💀', '🧙‍♂️']
  ]

  const deco = decoraciones[Math.floor(Math.random() * decoraciones.length)]
  const [d1, d2, d3, d4, d5, d6, d7, d8] = deco

  const frasesSenku = [
    '“La ciencia es la herramienta más poderosa del ser humano.”',
    '“¡10 mil millones por ciento de éxito!”',
    '“Incluso en piedra... el conocimiento no muere.”',
    '“Un solo experimento puede cambiar el mundo.”',
    '“¡La ciencia avanza con explosiones!”'
  ]
  const frase = frasesSenku[Math.floor(Math.random() * frasesSenku.length)]

  const encabezado = [
    `${d1}${d2}${d3} *LABORATORIO DE SENKU* ${d4}${d5}${d6}`,
    `🧠 ${frase}`,
    `${d7} Analizando estructura social del grupo... ${d8}\n`
  ].join('\n')

  // ⚗️ Generar tarjetas de cada miembro
  const tarjetas = participantes.map((p, index) => {
    const rawJid = p.id || 'N/A'
    const user = rawJid.split('@')[0]
    const domain = rawJid.split('@')[1]
    const lid = domain === 'lid' ? `${user}@lid` : `${user}@s.whatsapp.net`

    const estado = p.admin === 'superadmin'
      ? '👑 *Superadmin del Reino de la Ciencia*'
      : p.admin === 'admin'
        ? '🧪 *Administrador científico*'
        : '👤 *Miembro experimental*'

    const marco = Math.random() > 0.5
      ? [
          `${d2}${d3}${d4}╔══════════════════════╗${d5}${d6}`,
          ` ${d1} *Sujeto N°${index + 1}*`,
          ` ${d8} *Usuario:* @${user}`,
          ` ${d2} *LID:* ${lid}`,
          ` ${d3} *Estado:* ${estado}`,
          `${d4}${d5}${d6}╚══════════════════════╝${d7}${d8}`
        ]
      : [
          `${d1}${d2}${d3}┏━━━━━━━━━━━━━━━━━━━━━━┓${d4}${d5}`,
          ` ${d7} *Sujeto #${index + 1}*`,
          ` ${d8} *Usuario:* @${user}`,
          ` ${d2} *LID:* ${lid}`,
          ` ${d3} *Estado:* ${estado}`,
          `${d4}${d5}${d6}┗━━━━━━━━━━━━━━━━━━━━━━┛${d7}${d8}`
        ]

    return marco.join('\n')
  })

  const salida = [
    encabezado,
    tarjetas.join('\n\n'),
    `\n${d1}${d2}${d3} *Análisis completado con éxito.* ${d4}${d5}${d6}`,
    `⚛️ “La humanidad se levanta con ciencia.” – Senku Ishigami`
  ].join('\n')

  const mencionados = participantes.map(p => p.id).filter(Boolean)
  return conn.reply(m.chat, salida, m, { mentions: mencionados })
}

handler.command = ['lid']
handler.help = ['lid']
handler.tags = ['grupo']

export default handler
