let handler = async (m, { conn }) => {
  // Solo el owner puede usar este comando
  const senderNumber = m.sender.split('@')[0]
  const ownerNumbers = global.owner?.map(o => o.replace(/\D/g, '')) || []
  if (!ownerNumbers.includes(senderNumber)) {
    return conn.reply(m.chat, '🚫 Este comando solo puede usarlo el *Creador del Reino de la Ciencia*.', m)
  }

  try {
    // 🔬 Obtener todos los grupos donde el bot está
    const groups = await conn.groupFetchAllParticipating()
    const groupIds = Object.keys(groups)

    if (groupIds.length === 0) {
      return conn.reply(m.chat, '🧪 El bot no está en ningún grupo en este momento.', m)
    }

    // ⚗️ Decoraciones estilo Senku
    const decoraciones = [
      ['⚗️', '🧪', '🧬', '🔬', '💡', '🔭', '⚛️', '📡'],
      ['💠', '🔹', '🪐', '✨', '💫', '🛸', '🧠', '🧲'],
      ['🌌', '🚀', '🪐', '🛰️', '🌠', '☄️', '💫', '🌟'],
      ['💻', '🔧', '🧯', '🧰', '💾', '📀', '🔋', '🧮']
    ]
    const deco = decoraciones[Math.floor(Math.random() * decoraciones.length)]
    const [d1, d2, d3, d4, d5, d6, d7, d8] = deco

    // 🧠 Frase científica
    const frases = [
      '“La ciencia es el camino hacia la verdad.”',
      '“10 mil millones por ciento de precisión.”',
      '“Incluso la piedra puede aprender con ciencia.”',
      '“Un solo experimento puede cambiar el mundo.”'
    ]
    const frase = frases[Math.floor(Math.random() * frases.length)]

    // 🔭 Encabezado
    let mensaje = [
      `${d1}${d2}${d3} *LABORATORIO DE SENKU – REGISTRO DE GRUPOS* ${d4}${d5}${d6}\n`,
      `🧠 Total de grupos: *${groupIds.length}*`,
      `💬 Frase: _${frase}_`,
      `\n${d7} Analizando estructuras sociales... ${d8}\n`
    ].join('\n')

    // 🧬 Listar cada grupo
    for (const id of groupIds) {
      const group = groups[id]
      const participantes = group.participants?.length || 0
      mensaje += [
        `${d1}${d2}${d3}┏━━━━━━━━━━━━━━━━━━━━━━┓${d4}${d5}`,
        ` ${d7} *Nombre:* ${group.subject}`,
        ` ${d8} *ID:* \`${group.id}\``,
        ` ${d2} *Miembros:* ${participantes}`,
        `${d4}${d5}${d6}┗━━━━━━━━━━━━━━━━━━━━━━┛${d7}${d8}\n`
      ].join('\n')
    }

    mensaje += `\n${d1}${d2}${d3} *Fin del registro científico.* ${d4}${d5}${d6}`

    // 📡 Enviar al owner (para no llenar el chat público)
    await conn.reply(m.sender, mensaje, m)
  } catch (e) {
    console.error('Error en chatlist:', e)
    conn.reply(m.chat, '❌ Ocurrió un error al obtener la lista de grupos.', m)
  }
}

handler.help = ['chat']
handler.tags = ['owner']
handler.command = ['chat']
handler.owner = true

export default handler
