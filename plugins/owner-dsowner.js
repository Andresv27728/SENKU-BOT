/* Codigo hecho por @Fabri115 y mejorado por BrunoSobrino */

import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path'

var handler = async (m, { conn, usedPrefix }) => {

if (global.conn.user.jid !== conn.user.jid) {
return conn.reply(m.chat, `🚩 Utiliza este comando directamente en el número principal del Bot.`, m)
}
await conn.reply(m.chat, `⏳ Iniciando proceso de eliminación de todos los archivos de sesión, excepto el archivo creds.json...`, m)
m.react('⌛')

let sessionPath = `./${global.sessions}/`

try {

if (!existsSync(sessionPath)) {
return await conn.reply(m.chat, `📂 La carpeta de sesión no existe.`, m)
}
let files = await fs.readdir(sessionPath)
let filesDeleted = 0
for (const file of files) {
if (file !== 'creds.json') {
await fs.unlink(path.join(sessionPath, file))
filesDeleted++;
}
}
if (filesDeleted === 0) {
await conn.reply(m.chat, `✅ No se encontraron archivos de sesión para eliminar.`, m)
} else {
m.react('✅')
await conn.reply(m.chat, `🗑️ Se eliminaron ${filesDeleted} archivos de sesión.`, m)
conn.reply(m.chat, `👋 ¡Hola! ¿logras verme?`, m)

}
} catch (err) {
console.error('Error al leer la carpeta o los archivos de sesión:', err);
await conn.reply(m.chat, `❌ Ocurrió un fallo al eliminar los archivos de sesión.`, m)
}

}
handler.help = ['dsowner']
handler.tags = ['owner']
handler.command = ['delai', 'dsowner', 'clearallsession']
handler.rowner = true;

export default handler
