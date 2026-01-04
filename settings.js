/* código creado por 💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖 dejar créditos*/
import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"
import path from "path"
/* agregate como owner */
global.botNumber = ""
global.owner = ["573133374132" """]
/* No tocar podrías dañar múltiples comandos*/
global.suittag = [""]
global.prems = []
global.id_canal = ["120363399729727124@newsletter"]
global.name_canal = ["𝒮𝑒𝓃𝓀𝓊 𝐼𝓈𝒽𝒾𝑔𝒶𝓂𝒾"]
global.rcanal = true

global.libreria = "𝐁𝐑𝐀𝐈𝐋𝐄𝐘𝐒"
global.vs = "7.0"
global.nameqr = "𝒮𝑒𝓃𝓀𝓊 𝐼𝓈𝒽𝒾𝑔𝒶𝓂𝒾"
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.duckJadibts = true
global.apiadonix = 'https://apiadonix.kozow.com'
global.mayapi = 'https://mayapi.ooguy.com'
global.rapidapiKey = 'af11563abemshfa1b96b74c5d44ep1dcb7ajsnb5ab0d38ef96'
global.ffstalk_key = 'fgsiapi-2d090761-6d'
global.ch = {
ch1: "120363399729727124@newsletter"
}

export const defaultSettings = {
    botname: "𝒮𝑒𝓃𝓀𝓊 𝐼𝓈𝒽𝒾𝑔𝒶𝓂𝒾",
    textbot: "𝒮𝑒𝓃𝓀𝓊 𝐼𝓈𝒽𝒾𝑔𝒶𝓂𝒾",
    dev: "𝒮𝑒𝓃𝓀𝓊 𝐼𝓈𝒽𝒾𝑔𝒶𝓂𝒾",
    author: "yo soy yo",
    etiqueta: "𝒮𝑒𝓃𝓀𝓊 𝐼𝓈𝒽𝒾𝑔𝒶𝓂𝒾",
    currency: "1",
    banner: "https://files.catbox.moe/v8bvm3.jpg",
    icono: "https://files.catbox.moe/hoyzld.jpg"
}
/* No tocar*/
Object.assign(global, defaultSettings)

function leerSubBotConfig(senderBotNumber) {
    const configPath = path.join(global.jadi, senderBotNumber, 'config.json')
    if (fs.existsSync(configPath)) {
        try {
            const data = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
            return {
                name: data.name || defaultSettings.botname,
                banner: data.banner || defaultSettings.banner,
                video: data.video || null
            }
        } catch (e) {
            console.error("Error leyendo config subbot:", e)
        }
    }
    return { name: defaultSettings.botname, banner: defaultSettings.banner, video: null }
}


global.setSubBotData = (conn) => {
    const senderBotNumber = conn.user.jid.split('@')[0]
    const subBotData = leerSubBotConfig(senderBotNumber)
    global.botname = subBotData.name
    global.banner = subBotData.banner
    global.video = subBotData.video
}


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'settings.js'"))
    import(`${file}?update=${Date.now()}`)
})
