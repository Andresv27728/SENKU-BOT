let handler = async (m, { conn }) => {
  await m.reply('esto es un test')
}
handler.command = ['test']
export default handler