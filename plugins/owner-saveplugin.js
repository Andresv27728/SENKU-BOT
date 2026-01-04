import fs from 'fs';

let handler = async (m, { text, usedPrefix, command }) => {

    // Emojis predeterminados para evitar errores
    const emoji = "✅";
    const emoji2 = "⚠️";
    const msm = "❌";

    // Validar nombre del plugin
    if (!text) {
        return m.reply(`${emoji2} *Debes ingresar el nombre del plugin.*\nEjemplo:\n${usedPrefix + command} menu`);
    }

    // Validar que responda a un mensaje con contenido de texto
    if (!m.quoted || !m.quoted.text) {
        return m.reply(`${emoji2} *Responde al mensaje que contiene el código del plugin.*`);
    }

    const ruta = `plugins/${text}.js`;

    try {
        // Guardar plugin
        fs.writeFileSync(ruta, m.quoted.text);

        // Confirmación correcta
        m.reply(`${emoji} *Plugin guardado correctamente en:* \`${ruta}\``);

    } catch (error) {
        m.reply(`${msm} *Error al guardar el plugin:* ${error.message}`);
    }
};

handler.help = ['saveplugin'];
handler.tags = ['owner'];
handler.command = ['saveplugin'];
handler.owner = true;

export default handler;
