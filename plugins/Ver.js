const handler = async (m, { conn }) => {

  const dd = m.chat
  //m.chat 

  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''
  const fileName = (q.msg || q).fileName || `archivo.${mime.split('/')[1] || 'bin'}`

  if (!mime) {
    return conn.sendMessage(
      dd,
      { text: `Responde a un *archivo, imagen, video o audio* para reenviarlo\n`},
      { quoted: m }
    )
  }

  await m.react('🕒')

  try {
    const media = await q.download()
    if (!media) throw new Error('No se pudo descargar la media')

    if (/image/.test(mime)) {
      await conn.sendMessage(
        dd,
        { image: media //, caption: `📷 Aquí está tu imagen`
       },{ //quoted: m 
    })
    } else if (/video/.test(mime)) {
      await conn.sendMessage(
        dd,
        { video: media //, caption: `🎥 Aquí está tu video`
      },{ //quoted: m
      })
    } else if (/audio/.test(mime)) {
      await conn.sendMessage(
        dd,
        { audio: media, mimetype: mime, fileName, ptt: false},
        { //quoted: m
      })
    } else {
      // Documentos: pdf, docx, xls, zip, rar, etc. con su nombre original
      await conn.sendMessage(
        dd,
        { document: media, mimetype: mime, fileName },
        { quoted: m
      })
    }

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    await conn.sendMessage(
      dd,
      { text: ''},
      { quoted: m }
    )
  }
}

handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['ver']

export default handler
