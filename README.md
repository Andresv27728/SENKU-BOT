<div align="center"
style="
border: 4px solid;
border-image: linear-gradient(
  45deg,
  red,
  orange,
  yellow,
  lime,
  cyan,
  blue,
  magenta,
  red
) 1;
padding: 18px;
border-radius: 14px;
">

# ð§ªâ¡ **SENKU-BOT** â¡ð§ª  
### *Â¡10 mil millones por ciento funcional!*

<img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=for-the-badge&logo=node.js" />
<img src="https://img.shields.io/badge/Baileys-Latest-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/Status-Online-success?style=for-the-badge" />
<img src="https://img.shields.io/badge/Science-10000%25-brightgreen?style=for-the-badge" />

<br><br>

<a href="https://wa.me/573133374132?text=">
  <img src="https://img.shields.io/badge/Contactar%20Owner-WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white">
</a>

</div>

---

<div align="center">

ð§  **CIENCIA â¢ LÃGICA â¢ INNOVACIÃN**  
ð¤ **BOT DE WHATSAPP EN NODE.JS**

</div>

---

> *âLa ciencia lo puede todo.â*  
> **SENKU-BOT** es un bot de WhatsApp inspirado en **Senku Ishigami**, creado para experimentar, automatizar y llevar la lÃ³gica al mÃ¡ximo nivel.

---

## ð§¬ **Funciones Principales**

ð§ª Sistema de plugins  
âï¸ Comandos rÃ¡pidos y eficientes  
ð¥ Descargas de audio y video (TikTok, Facebook, Instagram)  
ð¨ MenÃºs decorados  
ð§  CÃ³digo organizado  
â¡ Rendimiento estable 24/7  

---

## ð **InstalaciÃ³n RÃ¡pida**

Para iniciar tu propio laboratorio, clona el repositorio:

```bash
git clone https://github.com/Andresv27728/SENKU-BOT
cd SENKU-BOT
npm install
npm start
```

---

## ð **DÃ³nde activar SENKU-BOT**

En **SwalloX Host** puedes encontrar SENKU-BOT disponible para instalar y ejecutarlo fÃ¡cilmente desde su panel.

ð¬ **Dashboard:** https://dash.swallox.com  
ð§° **Panel:** https://panel.swallox.com

---

## â­ **Apoya el Proyecto**

Si **SENKU-BOT** te parece increÃ­ble:
- â­ Dale una estrella al repositorio  
- ð CompÃ¡rtelo  
- ð§  Contribuye con ideas  

---

## ð **DocumentaciÃ³n del CÃ³digo**

### Arquitectura del Bot
- **`index.js`**: Punto de entrada principal, inicializa el servidor, conecta con Baileys y carga los plugins.
- **`handler.js`**: El corazón del bot, gestiona todos los eventos de mensajes entrantes, validación de permisos, y ejecución de plugins.
- **`lib/simple.js`**: Contiene métodos auxiliares y decoradores para facilitar la interacción con la API de Baileys (ej. `sendFile`, `reply`, `sendButton`).
- **`plugins/`**: Contiene la lógica modular de cada comando. Cada archivo exporta un objeto `handler` que debe incluir `command` y `help`.

### Guía para Desarrolladores
Para añadir un nuevo comando, crea un archivo `.js` dentro de la carpeta `plugins/` siguiendo este patrón:

```javascript
let handler = async (m, { conn, text, usedPrefix }) => {
  // Lógica del comando
  m.reply('¡Ciencia aplicada!')
}
handler.command = ['test']
export default handler
```

---

<div align="center"
style="
border: 4px solid;
border-image: linear-gradient(
  45deg,
  red,
  magenta,
  blue,
  cyan,
  lime,
  yellow,
  red
) 1;
padding: 16px;
border-radius: 16px;
">

### â¡ *Â¡Esto es ciencia pura!* â¡  
### *Â¡10 mil millones por ciento real!* ð§ª

</div>