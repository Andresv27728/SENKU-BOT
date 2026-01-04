import fetch from 'node-fetch'

export async function before(m, { conn }) {
  const response = await fetch(banner);
  const thumbnailBuffer = Buffer.from(await response.arrayBuffer());

  global.rcanal = {
    externalAdReply: {
      title: botname,
      body: author,
      mediaUrl: 'https://files.catbox.moe/l7u9x3.jpg',
      previewType: "PHOTO",
      thumbnail: thumbnailBuffer,
      sourceUrl: 'https://files.catbox.moe/l7u9x3.jpg',
      mediaType: 1,
      renderLargerThumbnail: false
    }
  }
}
