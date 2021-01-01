const { Client, Util, MessageEmbed, MessageAttachment } = require("discord.js");
const client = new Client();
const dbl = require("dblapi.js");
const bot = new dbl(process.env.BDL_TOKEN, client);
const figlet = require("figlet");
let exito_color = "#1BFF00";
const ms = require("ms");
const moment = require("moment");
require("moment-duration-format");
const soleno = require("solenolyrics");
const ILuck = require("discord.js");
const fetch = require("node-fetch");
const superagent = require("superagent");
const dimgs = require("discordimgs");
const megadb = require("megadb");
const Canvas = require("canvas");
const mongoose = require("mongoose");
const paradise = require("paradiseapi.js");
const { GiveawaysManager } = require("discord-giveaways");
const duration = require("humanize-duration");
let prohibido = new megadb.crearDB("prohibidos");
let prefixes = new megadb.crearDB("prefix");
let bienvenidas = new megadb.crearDB("bienvenidas");
let reaction = new megadb.crearDB("reaction");
let lang = new megadb.crearDB("language");

let custom = new megadb.crearDB("comandos");
let respuesta = new megadb.crearDB("respuesta");

let custom2 = new megadb.crearDB("comandos2");
let respuesta2 = new megadb.crearDB("respuesta2");

let custom3 = new megadb.crearDB("comandos3");
let respuesta3 = new megadb.crearDB("respuesta3");

let custom4 = new megadb.crearDB("comandos4");
let respuesta4 = new megadb.crearDB("respuesta4");

let custom5 = new megadb.crearDB("comandos5");
let respuesta5 = new megadb.crearDB("respuesta5");

let custom6 = new megadb.crearDB("comandos6");
let respuesta6 = new megadb.crearDB("respuesta6");

let cooldown = new Set();
let cooldown2 = new Set();
let used = new Map();
client.snipes = new Map();
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./database.json",
  updateCountdownEvery: 3000,
  default: {
    botsCanWin: false,
    embedColor: "#FF0000",
    reaction: "🎉"
  }
});
let staff = [
  "750351208556003409",
  "768924335028568094",
  "761404868460019732",
  "723158623404032022",
  "767176164808065044",
  "690677866555244596"
];

/////////////////////////////////////////EVENTO READY////////////////////////////////////////////
client.on("ready", async () => {
  await console.log(`${client.user.tag} Está listo!`);
  let estados = [
    `${client.guilds.cache.size} servers`,
    `${client.channels.cache.filter(x => x.type !== "category").size} canales`,
    `t!discord | t!invite`
  ];
  let posicion = 0;
  setInterval(async () => {
    if (posicion > estados.length - 1) posicion = 0;
    let estado = estados[posicion];
    await client.user.setActivity(estado, { type: "WATCHING" });
    posicion++;
  }, 10000);
  setInterval(async () => {
    await bot.postStats(client.guilds.cache.size);
  }, 1800000);
  setInterval(async () => {
    fetch(`https://voidbots.net/api/auth/stats/${client.user.id}`, {
      method: "POST",
      headers: {
        Authorization: process.env.VOID_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ server_count: client.guilds.cache.size })
    })
      .then(response => response.text())
      .then(console.log)
      .catch(console.error);
  }, 10800000);
  await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(console.log(`${client.user.tag} conectado a MongoDB!`));
  const pbl = new paradise(client.user.id, process.env.PARADISE_TOKEN);
  setInterval(() => {
    pbl.post(client.guilds.cache.size);
  }, 3600000);
});

/////////////////////////////////////////EVENTO MESSAGEDELETE///////////////////////////////////////
client.on("messageDelete", async message => {
  await client.snipes.set(message.channel.id, {
    content: message.content,
    delete: message.author,
    canal: message.channel,
    image: message.attachments.first()
      ? message.attachments.first().proxyURL
      : null
  });
});
///////////////////////////////////////EVENTO MESSAGE////////////////////////////////////////////////
client.on("message", async message => {
  if (!message.guild) return;

  let prefix = prefixes.tiene(message.guild.id)
    ? await prefixes.obtener(message.guild.id)
    : "t!";

  if (message.channel.id === "770615268161617930") {
    message.react("👍");
    message.react("👎");
  }

  try {
    let permisos = message.channel.permissionsFor(message.guild.me);

    let le = await lang.obtener(message.guild.id);

    if (!lang.tiene(message.guild.id)) le = "español";

    let words = [":v"];

    if (message.author.bot) return;

    if (!reaction.tiene(message.guild.id))
      reaction.establecer(message.guild.id, "habilitadas");

    let re = await reaction.obtener(message.guild.id);
    if (re == "habilitadas") {
      if (
        cooldown.has(message.author.id) &&
        !message.content.startsWith(prefix)
      )
        return;
      else {
        cooldown.add(message.author.id);
      }

      setTimeout(() => {
        cooldown.delete(message.author.id);
      }, 10000);

      if (words.some(a => message.content === a)) {
        message.react("787442646439821313");
      }
      let xd = ["xd"];
      if (xd.some(a => message.content === a)) {
        message.react("787442646116990986");
      }

      let otra = ["hola", "bienvenido", "bienvenida"];

      if (otra.some(a => message.content === a)) {
        message.react("787442644388413460");
      }
      let uwu = ["uwu"];
      if (uwu.some(a => message.content === a)) {
        message.react("787442647072899082");
      }
    }

    let command = message.content.toLowerCase().split(" ")[0];

    command = command.slice(prefix.length);

    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    if (message.content === `<@!${client.user.id}>`) {
      const hiembed = new MessageEmbed();
      if (le == "español") {
        hiembed
          .setTitle("Hey!")
          .setDescription(
            "Veo que me has mencionado, mi prefix aquí es **" +
              prefix +
              "**\n Usa " +
              prefix +
              "help para ver las categorías!"
          )
          .setAuthor(
            message.author.username,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setColor("YELLOW")
          .setTimestamp();
      } else {
        hiembed
          .setTitle("Hey!")
          .setDescription(
            "I see you mentioned me, my prefix here is **" +
              prefix +
              "**\n Use " +
              prefix +
              "help to view the category list!"
          )
          .setAuthor(
            message.author.username,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setColor("YELLOW")
          .setTimestamp();
      }
      message.channel.send(hiembed);
    }
    let ip = ["!ip", "1ip", "!pi", "1pi"];

    if (ip.some(msg => message.content == msg)) {
      if (message.guild.id != "779018714602930217") return;

      const minecraft = require("minecraft-server-util"),
        request = require("request");

      let port = args[1];

      if (!port) port = 25565;

      let pingURL = `https://api.minetools.eu/ping/mc17.mymcsv.ml`;

      request(pingURL, function(err, resp, body) {
        if (err) return console.error(err);
        body = JSON.parse(body);
        if (body.error)
          return message.channel.send(
            new MessageEmbed()
              .setTitle("Error")
              .setDescription(
                "Ha ocurrido un error\n\nError: el servidor está apagado!\n\n¿Qué puedo hacer?\nContactar a un staff\n\nIP: `mc17.mymcsv.ml`"
              )
              .setColor("#ff0000")
          );

        let url = `http://status.mclive.eu/MinecraftServer/mc17.mymcsv.ml/25565/banner.png`;

        minecraft
          .status("mc17.mymcsv.ml", { port: parseInt(port) })
          .then(async res => {
            const mine = new MessageEmbed()
              .setTitle("Estadísticas del server")
              .addField("IP del server", res.host)
              .addField("Versión", res.version)
              .addField("Ping", body.latency)
              .addField("Descripción", res.description.descriptionText)
              .addField(
                "Jugadores",
                res.onlinePlayers + " de " + res.maxPlayers
              )
              .setColor(exito_color)
              .setImage(url);

            message.channel.send(mine);
          });
      });
    }

    if (!message.content.toLowerCase().startsWith(prefix)) return;

    if (command === "tos") {
      const tos = new MessageEmbed()
        .setTitle("Condiciones de servicio")
        .setDescription(
          `1. No spames mis comandos
No hagas spam de serverinfo o comandos que tengan embed largos, inundan el chat.

2. No menciones a mucha gente usando comandos.
Como userinfo, avatar, etc, eso molesta a la gente.

3. No intentes usar comandos que no puedes usar
Como eval, o blacklist, no lo intentes, no te servira.

4. No exageres cuando criticas
Si quieres dar tu opinion del bot, por favor no exageres diciendo que es una p_t_ m__rd_a o algo asi.

5. No spames bugreports
Cada vez que usas el comando **${prefix}bugreport**, le envío un MD a ! PEPE, mi creador, y si eso pasa repetidas veces, le va a molestar (Tenemos un registro de quien reporta)

6. Las sugerencias se aplican con esto ^^^^^^

7. ¿Que pasa si veo que estoy en la blacklist?
Seguro es porque rompiste alguna o más de las condiciones de servicio mencionadas anteriormente, pero, si crees que no fue así, que esperas? Envíale un MD a ! PEPE#8888, o [entra a mi server!](https://discord.gg/shAnhwFA36) y mencionalo diciendo tu problema!

Saludos.
! PEPE#8888`
        )
        .setColor("#FF0000")
        .setTimestamp()
        .setThumbnail(
          "https://cdn.discordapp.com/attachments/766376477704192003/768668424888516648/Prohibido.png"
        );

      if (le == "español") {
        message.channel.send(tos);
        return;
      } else {
        tos
          .setTitle("Terms of service")
          .setDescription(
            `1. Don't spam my commands
Don't spam serverinfo or commands that have long embeds, they flood the chat.

2. Don't mention a lot of people using commands.
Like userinfo, avatar, etc, that disturbs people

3. Don't try to use commands that you cant use
Like eval, or blacklist, don't try it, it will not work for you

4. do not exaggerate when you criticize
If you want to give your opinion of the bot, please don't exaggerate like saying it's a f_c_i_g _h_t or something like that.

5. Don't spam bugreports
Every time you use the ** ${prefix} bugreport ** command, I send an MD to ! PEPE, my creator, and if that happens repeatedly, it will bother to him (We have a record of who reports)

6. Suggestions apply with this ^^^^^^

7. What if I see that I am on the blacklist?
Sure it is because you broke one or more of the conditions of service mentioned above, but, if you think it was not like that, what do you expect? Send an MD to ! PEPE#8888, or [go to my server!](https://discord.gg/shAnhwFA36) and mention him saying your problem!

Greetings:
! PEPE#8888`
          )
          .setColor("#ff0000")
          .setTimestamp()
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/766376477704192003/768668424888516648/Prohibido.png"
          );

        message.channel.send(tos);
      }
    }

    const ups = new MessageEmbed()
      .setTitle("Ups!")
      .setDescription(
        "Lo siento **" +
          message.author.username +
          "...**\nNo puedes usar mis comandos...\nRazón: Estas en la blacklist"
      )
      .setColor("#ff0000")
      .setFooter("Espera, no esperaste esto? usa " + prefix + "tos");
    if (prohibido.tiene(message.author.tag)) {
      if (command == "tos") return;
      if (le == "español") {
        message.channel.send(ups);
        return;
      } else {
        ups
          .setTitle("Ups!")
          .setDescription(
            `Sorry **${message.author.username}...**\nYou can't use my commands...\nReason: You are in the blacklist`
          )
          .setColor("#ff0000")
          .setFooter("Wait, didn't you expect this? use " + prefix + "tos");
        message.channel.send(ups);
        return;
      }
    }

    ///////////////////////////////////////COMANDO SERVERINFO/////////////////////////////////////////
    if (command === "serverinfo") {
      if (!permisos.has("EMBED_LINKS")) {
        if (le == "español")
          return message.channel.send(
            "Ups, no tengo permisos de insertar enlaces :sweat:"
          );
        else
          return message.channel.send(
            "Ups! looks like i don't have the permissions to insert links! :sweat:"
          );
      }
      let server = message.guild;
      let verifLevels, region;

      if (le == "español") {
        (region = {
          europe: "Europa :flag_eu:",
          brazil: "Brasil :flag_br: ",
          hongkong: "Hong Kong :flag_hk:",
          japan: "Japón :flag_jp:",
          russia: "Rusia :flag_ru:",
          singapore: "Singapur :flag_sg:",
          southafrica: "Sudáfrica :flag_za:",
          sydney: "Sydney :flag_au:",
          "us-central": "Central US :flag_us:",
          "us-east": "Este US :flag_us:",
          "us-south": "Sur US :flag_us:",
          "us-west": "Oeste US :flag_us:",
          "vip-us-east": "VIP US Este :flag_us:",
          "eu-central": "Europa Central :flag_eu:",
          "eu-west": "Europa Oeste :flag_eu:",
          london: "London :flag_gb:",
          amsterdam: "Amsterdam :flag_nl:",
          india: "India :flag_in:"
        }),
          (verifLevels = {
            NONE: "Ninguno",
            LOW: "Debe tener un correo verificado en Discord",
            MEDIUM: "Debe estar registrado en Discord por 5 minutos o más",
            HIGH: "Debe estar en el servidor por más de 10 minutos",
            VERY_HIGH: "Debe tener un correo verificado en Discord"
          });
      } else {
        (region = {
          europe: "Europe :flag_eu:",
          brazil: "Brazil :flag_br: ",
          hongkong: "Hong Kong :flag_hk:",
          japan: "Japan :flag_jp:",
          russia: "Russia :flag_ru:",
          singapore: "Singapore :flag_sg:",
          southafrica: "South Africa :flag_za:",
          sydney: "Sydney :flag_au:",
          "us-central": "Central US :flag_us:",
          "us-east": "East US :flag_us:",
          "us-south": "South US :flag_us:",
          "us-west": "West US :flag_us:",
          "vip-us-east": "VIP US East :flag_us:",
          "eu-central": "Europe Central :flag_eu:",
          "eu-west": "Europe West :flag_eu:",
          london: "London :flag_gb:",
          amsterdam: "Amsterdam :flag_nl:",
          india: "India :flag_in:"
        }),
          (verifLevels = {
            NONE: "None",
            LOW: "Must have a verified email on Discord",
            MEDIUM: "Must be registered on Discord for 5 minutes or more",
            HIGH: "Must be in the server for 10 minutes or more",
            VERY_HIGH: "Must have a verified phone on Discord"
          });
      }

      const embed = new MessageEmbed();

      if (le == "español") {
        moment.locale("es");

        embed
          .setThumbnail(
            message.guild.iconURL({
              format: "png",
              dynamic: true,
              size: 4096
            })
          )
          .setAuthor(server.name, server.iconURL({ dynamic: true, size: 4096 }))
          .addField("Creación", moment.utc(server.createdAt).format("LLLL"))
          .addField("ID:", server.id)
          .addField("Región:", `**${region[server.region]}**`, true)
          .addField("Total de miembros:", server.memberCount, true)
          .addField(
            "<a:Online:787442640438296627> Conectados:",
            server.members.cache.filter(o => o.presence.status === "online")
              .size,
            true
          )
          .addField(
            "<:Idle:787442640945414255> Ausentes:",
            server.members.cache.filter(o => o.presence.status === "idle").size,
            true
          )
          .addField(
            "<a:dnd:787442638034829323> No molestar:",
            server.members.cache.filter(o => o.presence.status === "dnd").size,
            true
          )
          .addField(
            "<a:Offline:787442642383536138> Desconectados:",
            server.members.cache.filter(o => o.presence.status === "offline")
              .size,
            true
          )
          .addField(
            ":robot: Bots:",
            `${
              //Los bots
              message.guild.members.cache.filter(m => m.user.bot).size
            }`,
            true
          )
          .addField(
            ":bust_in_silhouette: Usuarios sin contar bots:",
            `${message.guild.members.cache.filter(m => !m.user.bot).size}`,
            true
          )
          .addField(
            `Nivel de verificación`,
            `**${verifLevels[server.verificationLevel]}**`,
            false
          )
          .addField(
            "Canales en total:",
            server.channels.cache.filter(x => x.type !== "category").size,
            true
          )
          .addField(
            "Canales de texto",
            server.channels.cache.filter(x => x.type == "text").size,
            true
          )
          .addField(
            "Canales de voz",
            server.channels.cache.filter(x => x.type == "voice").size,
            true
          )
          .addField(
            "Categorías",
            server.channels.cache.filter(x => x.type == "category").size,
            true
          )
          .addField(`Número de roles`, server.roles.cache.size, true)
          .addField("Rol más alto", message.guild.roles.highest.toString())
          .addField("Número de emojis", server.emojis.cache.size, true)
          .addField("Nivel de boost", server.premiumTier.toString(), true)
          .addField("Mejoras totales", server.premiumSubscriptionCount, true)
          .addField(
            "Canal por defecto",
            server.systemChannelID
              ? "<#" + server.systemChannelID + ">"
              : "Ninguno",
            true
          )
          .setColor(0xf7a7ff)
          .setImage(server.bannerURL({ dynamic: true, size: 4096 }))
          .setFooter(
            "Tessirve?",
            "https://cdn.discordapp.com/emojis/767792922773946419.png"
          );
        message.channel.send(embed);
      } else {
        embed
          .setAuthor(server.name, server.iconURL({ dynamic: true, size: 4096 }))
          .setThumbnail(
            message.guild.iconURL({
              format: "png",
              dynamic: true,
              size: 4096
            })
          )
          .addField(
            "Creation",
            moment.utc(server.createdAt).format("LLLL"),
            true
          )
          .addField("ID:", server.id)
          .addField("Region:", `**${region[server.region]}**`, true)
          .addField("All members:", server.memberCount, true)
          .addField(
            "<a:Online:787442640438296627> Connected:",
            server.members.cache.filter(o => o.presence.status === "online")
              .size,
            true
          )
          .addField(
            "<:Idle:787442640945414255> Idle:",
            server.members.cache.filter(o => o.presence.status === "idle").size,
            true
          )
          .addField(
            "<a:dnd:787442638034829323> Do not disturb:",
            server.members.cache.filter(o => o.presence.status === "dnd").size,
            true
          )
          .addField(
            "<a:Offline:787442642383536138> Offline:",
            server.members.cache.filter(o => o.presence.status === "offline")
              .size,
            true
          )
          .addField(
            ":robot: Bots:",
            `${message.guild.members.cache.filter(m => m.user.bot).size}`,
            true
          )
          .addField(
            ":bust_in_silhouette: Users without bots:",
            `${message.guild.memberCount -
              message.guild.members.cache.filter(m => m.user.bot).size}`,
            true
          )
          .addField(
            `Verification level`,
            `**${verifLevels[server.verificationLevel]}**`,
            false
          )
          .addField(
            "All channels:",
            server.channels.cache.filter(x => x.type !== "category").size,
            true
          )
          .addField(
            "Text channels",
            server.channels.cache.filter(x => x.type == "text").size,
            true
          )
          .addField(
            "Voice channels",
            server.channels.cache.filter(x => x.type == "voice").size,
            true
          )
          .addField(
            "Categories",
            server.channels.cache.filter(x => x.type == "category").size,
            true
          )
          .addField(`Number of roles`, server.roles.cache.size, true)
          .addField("Highest role", message.guild.roles.highest.toString())
          .addField("Number of emojis", server.emojis.cache.size, true)
          .addField("Boost level", server.premiumTier.toString(), true)
          .addField("Boost count", server.premiumSubscriptionCount, true)
          .addField(
            "System channel",
            server.systemChannelID
              ? "<#" + server.systemChannelID + ">"
              : "None",
            true
          )
          .setColor(0xf7a7ff)
          .setImage(server.bannerURL({ dynamic: true, size: 4096 }))
          .setFooter(
            "Serves you?",
            "https://cdn.discordapp.com/emojis/767792922773946419.png"
          );
        message.channel.send(embed);
      }
    }
    //////////////////////////////////////////////COMANDO EVAL//////////////////////////////////////////////////////
    else if (command === "eval" || command === "e") {
      if (!staff.includes(message.author.id)) {
        if (le == "español")
          return message.channel.send("No estas autorizado a usar esto!");
        else return message.channel.send("You are not allowed to do this!");
      }

      let limit = 2000;
      try {
        let code = args.slice(1).join(" ");
        let evalued = eval(code);
        if (typeof evalued !== "string")
          evalued = require("util").inspect(evalued);
        let txt = "" + evalued;

        if (txt.length > limit) {
          message.channel.send("Texto demasiado largo");
        } else message.channel.send(txt);
      } catch (err) {
        message.channel.send("⚠️ " + err);
      }
    }

    /////////////////////////////////////////////COMANDO SAY////////////////////////////////////////////////
    else if (command === "say") {
      let verifLevels, region;

      if (le == "español") {
        (region = {
          europe: "Europa :flag_eu:",
          brazil: "Brasil :flag_br: ",
          hongkong: "Hong Kong :flag_hk:",
          japan: "Japón :flag_jp:",
          russia: "Rusia :flag_ru:",
          singapore: "Singapur :flag_sg:",
          southafrica: "Sudáfrica :flag_za:",
          sydney: "Sydney :flag_au:",
          "us-central": "Central US :flag_us:",
          "us-east": "Este US :flag_us:",
          "us-south": "Sur US :flag_us:",
          "us-west": "Oeste US :flag_us:",
          "vip-us-east": "VIP US Este :flag_us:",
          "eu-central": "Europa Central :flag_eu:",
          "eu-west": "Europa Oeste :flag_eu:",
          london: "London :flag_gb:",
          amsterdam: "Amsterdam :flag_nl:",
          india: "India :flag_in:"
        }),
          (verifLevels = {
            NONE: "Ninguno",
            LOW: "Bajo",
            MEDIUM: "Medio",
            HIGH: "Alto",
            VERY_HIGH: "Muy alto"
          });
      } else {
        (region = {
          europe: "Europe :flag_eu:",
          brazil: "Brazil :flag_br: ",
          hongkong: "Hong Kong :flag_hk:",
          japan: "Japan :flag_jp:",
          russia: "Russia :flag_ru:",
          singapore: "Singapore :flag_sg:",
          southafrica: "South Africa :flag_za:",
          sydney: "Sydney :flag_au:",
          "us-central": "Central US :flag_us:",
          "us-east": "East US :flag_us:",
          "us-south": "South US :flag_us:",
          "us-west": "West US :flag_us:",
          "vip-us-east": "VIP US East :flag_us:",
          "eu-central": "Europe Central :flag_eu:",
          "eu-west": "Europe West :flag_eu:",
          london: "London :flag_gb:",
          amsterdam: "Amsterdam :flag_nl:",
          india: "India :flag_in:"
        }),
          (verifLevels = {
            NONE: "None",
            LOW: "Low",
            MEDIUM: "Medium",
            HIGH: "High",
            VERY_HIGH: "Very high"
          });
      }
      const embed = new MessageEmbed();
      if (le == "español") {
        embed
          .setTitle("Hey")
          .setDescription(
            "No has dicho nada! aqui hay algunas alias que puedes usar si quieres:"
          )
          .addField("{user}", "Tu nombre de usuario")
          .addField("{server.name}", "El nombre del servidor")
          .addField("{server.id}", "La ID del servidor")
          .addField("{user.id}", "Tu ID")
          .addField("{user.avatar}", "Tu avatar URL")
          .addField("{server.icon}", "El ícono URL del servidor")
          .addField(
            "{server.verification}",
            "El nivel de verificación del servidor"
          )
          .addField("{server.region}", "La región del servidor")
          .setColor("#ff0000");
      } else {
        embed
          .setTitle("Hey!")
          .setDescription(
            "You didn't say nothing! Here are some alias you can use:"
          )
          .addField("{user}", "Your user name")
          .addField("{server.name}", "The server name")
          .addField("{server.id}", "The server ID")
          .addField("{user.id}", "Your ID")
          .addField("{user.avatar}", "Your avatar URL")
          .addField("{server.icon}", "The server's icon URL")
          .addField("{server.verification}", "The server verification level")
          .addField("{server.region}", "The server region")
          .setColor("#ff0000");
      }
      let say = args
        .slice(1)
        .join(" ")
        .replace("{user}", message.author.username)
        .replace("{server.name}", message.guild.name)
        .replace("{server.id}", message.guild.id)
        .replace("{user.id}", message.author.id)
        .replace(
          "{user.avatar}",
          message.author.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: ""
          })
        )
        .replace(
          "{server.icon}",
          message.guild.iconURL({ dynamic: true, format: "png", size: "" })
        )
        .replace(
          "{server.verification}",
          verifLevels[message.guild.verificationLevel]
        )
        .replace("{server.region}", region[message.guild.region]);

      if (!say || say == null) return message.channel.send(embed);
      if (message.deletable) message.delete();
      let links = [
        "https://",
        "www.",
        "web.",
        "http://",
        "discord.gg/",
        "discord.com/invite/",
        "discord.new/",
        "discord.com/oauth2"
      ];
      if (
        links.some(x => message.content.includes(x)) &&
        !message.member.permissions.has("MANAGE_MESSAGES")
      )
        return message.channel.send(
          "No puedes usar links en el say a menos de que tengas permisos de administrar mensajes!"
        );
      message.channel.send(say, { disableMentions: "all" });
    }
    //////////////////////////////////////////////COMANDO BAN////////////////////////////////////////////////
    else if (command === "ban") {
      var razon = args.slice(2).join(" ");
      let persona = message.mentions.members.first();
      if (
        le == "español" &&
        ["762599129443467294", "739811956638220298"].includes(message.guild.id)
      )
        return message.channel.send(
          "Los comandos de moderación están deshabilitados en este server!"
        );
      else if (
        le == "english" &&
        ["762599129443467294", "739811956638220298"].includes(message.guild.id)
      )
        return message.channel.send(
          "Moderation commands are disabled on this guild!"
        );
      else if (
        le == "español" &&
        !message.guild.me.permissions.has("BAN_MEMBERS")
      )
        return message.channel.send(
          "Necesito el permiso de banear para continuar"
        );
      else if (
        le == "english" &&
        !message.guild.me.permissions.has("BAN_MEMBERS")
      )
        return message.channel.send("I need ban permissions to continue");
      else if (
        le == "español" &&
        !message.member.permissions.has("BAN_MEMBERS")
      )
        return message.channel.send(
          "No tienes el permiso siguiente: `Banear`."
        );
      if (le == "english" && !message.member.permissions.has("BAN_MEMBERS"))
        return message.channel.send("You don't have permissions to ban!");
      else if (le == "english" && !persona)
        return message.channel.send("You have to mention someone!");
      else if (le == "español" && !persona)
        return message.channel.send("Debes mencionar a alguien!");
      else if (le == "english" && !persona)
        return message.channel.send("You have to mention someone!");
      else if (le == "english" && !persona.bannable)
        return message.channel.send(
          "That person/bot has a role equal or higher than mine! :sweat:"
        );
      else if (le == "español" && !persona.bannable)
        return message.channel.send(
          "Esa persona/bot tiene un rol igual o mayor al mío! :sweat:"
        );
      else if (
        le == "español" &&
        persona.roles.highest.comparePositionTo(message.member.roles.highest) >
          0
      )
        return message.channel.send(
          "Esta persona esta en la misma o mayor nivel de jerarquia que tu, no puedes banearlo"
        );
      else if (
        le == "english" &&
        persona.roles.highest.comparePositionTo(message.member.roles.highest) >
          0
      )
        return message.channel.send(
          "That person/bot has an equal or higher role than you, you can't ban they"
        );
      else if (le == "english" && !razon) {
        razon = "Reason no specified";
      } else if (le == "español" && !razon) {
        razon = "Razon no especificada";
      }

      var razon2 = `${message.author.tag}: ${razon}`;

      message.guild.members.ban(persona, {
        reason: razon2
      });
      if (le == "español") {
        message.channel.send({
          embed: {
            title: "Baneado con éxito! ✅",
            color: exito_color,
            fields: [
              {
                name: "Baneado:",
                value: `${persona.user.username}`,
                inline: true
              },
              {
                name: "Moderador:",
                value: `<@${message.author.id}>`,
                inline: true
              },
              {
                name: "Razón:",
                value: razon,
                inline: true
              }
            ]
          }
        });
      } else {
        message.channel.send({
          embed: {
            title: "Successfully banned! ✅",
            color: exito_color,
            fields: [
              {
                name: "Banned:",
                value: `${persona.user.username}`,
                inline: true
              },
              {
                name: "Moderator:",
                value: `<@${message.author.id}>`,
                inline: true
              },
              {
                name: "Reason:",
                value: razon,
                inline: true
              }
            ]
          }
        });
      }
    }
    ///////////////////////////////////////////////////////////////COMANDO STATS//////////////////////////////////////
    else if (command === "stats") {
      if (le == "español") {
        moment.updateLocale("es", {
          months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
            "_"
          ),
          monthsShort: "Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov.Dec.".split(
            "_"
          ),
          weekdays: "Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado".split(
            "_"
          ),
          weekdaysShort: "Dom._Lun._Mar._Mier._Jue._Vier._Sab.".split("_"),
          weekdaysMin: "Do_Lu_Ma_Mi_Ju_ViSa".split("_")
        });
        moment.locale("es");

        if (!permisos.has("EMBED_LINKS"))
          return message.channel.send(
            "Ups, al parecer no tengo permisos de insertar enlaces :sweat:"
          );

        const top = new MessageAttachment(
          "https://top.gg/api/widget/763042495655313479.png",
          "textbot.png"
        );
        const actividad = moment
          .duration(client.uptime)
          .format(" D [dias], H [horas], m [mins], s [segundos]");

        const statsembed = new MessageEmbed()
          .setColor(0x66ff66)

          .setAuthor(`Stats del bot`, client.user.displayAvatarURL())
          .addField(`Dueño`, `! PEPE#8888`, true)
          .addField(`Version`, `Version 1.2.7`, true)
          .addField(
            `Libreria`,
            `Discord.js ^${require("discord.js").version}`,
            true
          )
          .addField(
            `Memoria`,
            `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            true
          )
          .addField(`Tiempo en línea`, actividad, false)
          .addField(`Servidores`, client.guilds.cache.size, true)

          .addField(
            `Canales`,
            client.channels.cache.filter(x => x.type !== "category").size,
            true
          )
          .addField(
            "Ping:",
            Math.floor(Date.now() - message.createdTimestamp) + "ms",
            true
          )
          .addField(
            "Creado el",
            moment.utc(client.user.createdAt).format("LLLL")
          )
          .addField(
            "STATS TOP.GG",
            "Aqui veras las estadisticas del bot en top.gg, [Mirame aquí](https://top.gg/bot/763042495655313479)"
          );

        message.channel.send(statsembed);
        message.channel.send(top);
      } else {
        moment.locale("en");
        if (!permisos.has("EMBED_LINKS"))
          return message.channel.send(
            "Ups, looks like i don't have permissions to insert"
          );

        const top = new MessageAttachment(
          "https://top.gg/api/widget/763042495655313479.png",
          "textbot.png"
        );
        const actividad = moment
          .duration(client.uptime)
          .format(" D [days], H [hours], m [mins], s [seconds]");

        const statsembed = new MessageEmbed()
          .setColor(0x66ff66)

          .setAuthor(`Bot stats`, client.user.displayAvatarURL())
          .addField(`Owner`, `! PEPE#8888`, true)
          .addField(`Version`, `Version 1.2.7`, true)
          .addField(
            `Library`,
            `Discord.js ^${require("discord.js").version}`,
            true
          )
          .addField(
            `Memory`,
            `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            true
          )
          .addField(`Uptime`, actividad, false)
          .addField(`Servers`, client.guilds.cache.size, true)

          .addField(
            `Channels`,
            client.channels.cache.filter(x => x.type !== "category").size,
            true
          )
          .addField(
            "Ping:",
            Math.floor(Date.now() - message.createdTimestamp) + "ms",
            true
          )
          .addField(
            "Created at",
            moment.utc(client.user.createdAt).format("LLLL")
          )
          .addField(
            "STATS TOP.GG",
            "Here you will see bot stats in top.gg, [See me here](https://top.gg/bot/763042495655313479)"
          );

        message.channel.send(statsembed);
        message.channel.send(top);
      }
    }
    ////////////////////////////////////////////////////////COMANDO HELP/////////////////////////////////////
    else if (command === "help" || command === "ayuda") {
      if (le == "español" && !permisos.has("EMBED_LINKS"))
        return message.channel.send("No tengo permisos de insertar enlaces!");
      if (le == "english" && !permisos.has("EMBED_LINKS"))
        return message.channel.send(
          "Ups, i dont have permissions to insert links! :sweat:"
        );
      const noayuda = new MessageEmbed();
      if (le == "español") {
        noayuda
          .setTitle("Lista de categorías")
          .addField(prefix + "help/ayuda", "Esto! :smiley:")
          .addField(
            prefix + "moderation",
            ":no_entry: Muestra comandos de moderación"
          )
          .addField(prefix + "fun", ":rofl: Muestra comandos de diversion")
          .addField(
            prefix + "info",
            ":information_source: Muestra comandos de informacion"
          )
          .addField(
            prefix + "support",
            ":question: Muestra comandos de soporte"
          )
          .addField(
            prefix + "notes",
            ":pencil2: Soy un bot de texto no? Pues aquí estan las notas!"
          )
          .addField(
            prefix + "no-categoria",
            "Muestra comandos no categorizados"
          )
          .addField(
            prefix + "ad",
            "Muestra una publicidad (tal vez te guste! :partying_face:)"
          );
      } else if (le == "english") {
        noayuda
          .setTitle("Category list")
          .addField(prefix + "help/ayuda", "This! :smiley:")
          .addField(
            prefix + "moderation",
            ":no_entry: Show moderation commands"
          )
          .addField(prefix + "fun", ":rofl: Show fun commands")
          .addField(
            prefix + "info",
            ":information_source: Show information commands"
          )
          .addField(prefix + "support", ":question: Show support commands")
          .addField(
            prefix + "notes",
            ":pencil2: I am a text bot, no? So here are note commands!"
          )
          .addField(prefix + "no-categoria", "Show non-categorized commands")
          .addField(
            prefix + "ad",
            "Shows an advertisment (maybe you like it! :partying_face:"
          );
      }

      if (!permisos.has("ADD_REACTIONS")) return message.channel.send(noayuda);
      if (le == "español" && !permisos.has("SEND_MESSAGES"))
        return message.author.send("No tengo permisos de mandar mensajes!");

      if (le == "english" && !permisos.has("SEND_MESSAGES"))
        return message.author.send("I dont have permissions to send messages!");

      const eco = new MessageEmbed().setColor(exito_color);
      if (le == "español") {
        eco
          .setTitle("Comandos de economía :money_with_wings:")
          .addField(prefix + "work", "Trabaja para obtener dinero")
          .addField(
            prefix + "crime",
            "Has un crimen para obtener dinero (puedes perderlo tambien)"
          )
          .addField(prefix + "dep (monto/all)", "Deposita dinero en el banco")
          .addField(prefix + "with (monto/all)", "Saca dinero del banco")
          .addField(prefix + "rob (@user)", "Roba a alguien")
          .addField(
            prefix + "bal (opcional mencion)",
            "Mira el balance tuyo o de otro"
          );
      } else {
        eco
          .setTitle("Economy commands :money_with_wings:")
          .addField(prefix + "work", "Work to get money")
          .addField(
            prefix + "crime",
            "Do a crime to get money (you can lose too)"
          )
          .addField(prefix + "dep (mount/all)", "Deposit money on the bank")
          .addField(prefix + "with (mount/all)", "Take money out of the bank")
          .addField(prefix + "rob (@user)", "Rob someone")
          .addField(
            prefix + "bal (opcional mencion)",
            "See the balance of you or someone else"
          );
      }

      const n = new MessageEmbed();
      if (le == "español") {
        n.setTitle("Notas! :pencil2:")
          .addField(prefix + "notas", "Mira tus notas")
          .addField(prefix + "notas añadir (texto)", "Añade una nota")
          .addField(
            prefix + "notas quitar (ID/all)",
            "Quita una nota con la ID"
          )
          .addField(
            prefix + "notas editar (ID) (nuevo texto)",
            "Edita una nota"
          )
          .setThumbnail(client.user.displayAvatarURL())
          .setColor("YELLOW");
      }
      if (le == "english") {
        n.setTitle("Notes! :pencil2:")
          .addField(prefix + "notas", "Show your notes")
          .addField(prefix + "notas añadir (text)", "Add a note")
          .addField(
            prefix + "notas quitar (ID/all)",
            "Deletes a note with de ID"
          )
          .addField(prefix + "notas editar (ID) (new text)", "Edits a note")
          .setThumbnail(client.user.displayAvatarURL())
          .setColor("YELLOW");
      }

      const modembed = new MessageEmbed();
      if (le == "español") {
        modembed
          .setTitle("Comandos de moderación")
          .addField(
            prefix + "ban (@usuario) (razón)",
            "Banea a a alguien",
            true
          )
          .addField(
            prefix + "kick (@usuario) (razón)",
            "Expulsa a alguien.",
            true
          )
          .addField(prefix + "clear (1/100)", "Borra mensajes", true)
          .addField(
            prefix + "prefix (nuevo prefix)",
            "Cambia el prefix del bot!",
            true
          )
          .addField(
            prefix + "setwelcome (#canal)",
            "Configura el canal de bienvenidas.",
            true
          )
          .addField(
            prefix + "desactivate-welcome",
            "Desactiva las bienvenidas",
            true
          )
          .addField(
            prefix + "setcooldown (tiempo)",
            "Establece un modo pausado para el canal. [s = segundos/m = minutos/h = horas]",
            true
          )
          .addField(prefix + "hackban (ID)", "Banea a alguien por la ID", true)
          .addField(
            prefix + "backup <create**/**info (ID)**/**load (ID)>",
            "Crea, mira la info, o carga backups",
            true
          )
          .addField(
            prefix + "poll (#canal/pregunta/opcion1/opcion2)",
            "Crea una encuesta personalizada",
            true
          )
          .addField(
            prefix + "reactions <on|off>",
            "Si pones alguna palabra que esté en mi configuración y que no empieze con mi prefix, reaccionaré, puedes desactivar o activar esta configuración.",
            true
          )
          .addField(
            prefix + "lang (lenguaje)",
            "Literal esto le costó a mi creador (" +
              prefix +
              "stats) 5 días en traducir ._. Cambia el lenguaje del bot!"
          )
          .addField(
            prefix + "gstart (#canal/duracion/ganadores/premio)",
            "Comienza un giveaway",
            true
          )
          .addField(prefix + "gend (mensaje ID)", "Termina un giveaway", true)
          .addField(
            prefix + "greroll (mensaje ID)",
            "Rerollea un giveaway",
            true
          )
          .setColor("#ff0000");
      }
      if (le == "english") {
        modembed
          .setTitle("Moderation commands")
          .addField(
            prefix + "ban (@user) (reason)",
            "Bans mentioned user",
            true
          )
          .addField(
            prefix + "kick (@user) (reason)",
            "Kicks mentioned user.",
            true
          )
          .addField(prefix + "clear (1/100)", "Deletes messages", true)
          .addField(
            prefix + "prefix (new prefix)",
            "Change bot's prefix!",
            true
          )
          .addField(
            prefix + "setwelcome (#channel)",
            "Sets the welcome channel.",
            true
          )
          .addField(
            prefix + "desactivate-welcome",
            "Desactivates the welcome channel",
            true
          )
          .addField(
            prefix + "setcooldown (time)",
            "Sets a slowmode for the channel [s = seconds/m = minutes/h = hours]",
            true
          )
          .addField(prefix + "hackban (ID)", "Bans someone with the ID", true)
          .addField(
            prefix + "backup <create**/**info (ID)**/**load (ID)>",
            "Creates, view info, or loads backups",
            true
          )
          .addField(
            prefix + "poll (#channel/question/option1/option2)",
            "Creates a custom poll",
            true
          )
          .addField(
            prefix + "reactions <on|off>",
            "If you put some word that is in my configuration and that does not start with my prefix, I will react, you can deactivate or activate this configuration.",
            true
          )
          .addField(
            prefix + "lang (language)",
            "Literally this command tooks my owner (" +
              prefix +
              "stats) 5 days to traduce ._. Change the language of the bot!"
          )
          .addField(
            prefix + "gstart (#channel/duration/winners/prize)",
            "Starts a giveaway",
            true
          )
          .addField(prefix + "gend (message ID)", "Ends a giveaway", true)
          .addField(prefix + "greroll (message ID)", "Rerolls a giveaway", true)
          .setColor("#ff0000");
      }

      const funembed = new MessageEmbed();
      if (le == "español") {
        funembed
          .setTitle("Comandos divertidos :zany_face:")
          .addField(prefix + "howgay", "Mira qué tan gay eres", true)
          .addField(prefix + "ascii", "Convierte tu texto a texto ascii", true)
          .addField(
            prefix + "8ball",
            "Pregunta algo y te contestaré con algo random",
            true
          )
          .addField(
            prefix + "slap (@usuario)",
            "Le das una cachetada a alguien",
            true
          )
          .addField(
            prefix + "chat (texto)",
            "Chateas con el bot en todos los lenguajes!",
            true
          )
          .addField(prefix + "meme", "Meme random", true)
          .addField(
            prefix + "ppt [piedra/papel/tijera]",
            "Juega a piedra papel o tijera",
            true
          )
          .addField(
            prefix + "trump (mensaje)",
            "Imagen de trump mostrando tu mensaje",
            true
          )
          .addField(
            prefix + "imgsearch (búsqueda)",
            "Busca imágenes en internet",
            true
          )
          .addField(
            prefix + "mirror (opcional mención o ID)",
            "Muestra lo que más quieres en este mundo y el avatar",
            true
          )
          .addField(
            prefix + "usersay (opcional mención) (mensaje)",
            "Muestra una imagen de un usuario diciendo lo que dices",
            true
          )
          .setColor(exito_color);
      }
      if (le == "english") {
        funembed
          .setTitle("Fun commands :zany_face:")
          .addField(prefix + "howgay", "Show how gay are you", true)
          .addField(prefix + "ascii", "Converts your text to ASCII text", true)
          .addField(
            prefix + "8ball",
            "Ask something and i will reply with something random",
            true
          )
          .addField(prefix + "slap (@user)", "You slap someone", true)
          .addField(prefix + "chat (texto)", "Chat with the bot!", true)
          .addField(prefix + "meme", "Random meme", true)
          .addField(
            prefix + "ppt [rock/paper/scissors]",
            "Play rock paper or scissors",
            true
          )
          .addField(
            prefix + "trump (message)",
            "Trump image showing your message",
            true
          )
          .addField(
            prefix + "imgsearch (search)",
            "Search images on internet",
            true
          )
          .addField(
            prefix + "mirror (opcional mention or ID)",
            "Shows what you want most in this world and the avatar (spanish)"
          )
          .addField(
            prefix + "usersay (optional mention) (message)",
            "Shows an image of someone saying your message",
            true
          )
          .setColor(exito_color);
      }

      const support = new MessageEmbed();
      if (le == "español") {
        support
          .setTitle("Comandos de soporte")
          .addField(prefix + "discord", "Link a mi servidor de soporte")
          .addField(prefix + "suggest", "Sugiere algo para el bot")
          .addField(prefix + "bugreport (mensaje)", "Reporta un bug del bot")
          .setColor("#ff0000");
      }
      if (le == "english") {
        support
          .setTitle("Support commands")
          .addField(prefix + "discord", "Link to my support server")
          .addField(prefix + "suggest", "Suggest something of the bot")
          .addField(
            prefix + "bugeport (message)",
            "report something of the bot"
          )
          .setColor("#ff0000");
      }

      const infoembed = new MessageEmbed();
      if (le == "español") {
        infoembed
          .setTitle("Comandos de info")
          .addField(prefix + "serverinfo", "Muestra info del servidor", true)
          .addField(
            prefix + "avatar",
            "Muestra el avatar tuyo o el de otro",
            true
          )
          .addField(prefix + "servericon", "Muestra el ícono del server", true)
          .addField(
            prefix + "user (opcional mención o ID)",
            "Muestra información del usuario",
            true
          )
          .addField(prefix + "ping", "Muestra la latencia del bot", true)
          .addField(prefix + "stats", "Mira las estadísticas del bot", true)
          .addField(
            prefix + "lyrics (canción)",
            "Mira la letra de una canción.",
            true
          )
          .addField(prefix + "invite", "Muestra la invitación del bot", true)
          .addField(
            prefix + "calculate/calc (operación)",
            "Calcula algo, los simbolos son + - * /",
            true
          )
          .addField(
            prefix + "covid (pais)",
            "Muestra la información del ~~Covid-19~~ de un país (debe ser en ingles)",
            true
          )
          .addField(
            prefix + "playstore (app)",
            "Obtiene información de una aplicación o un juego.",
            true
          )
          .addField(
            prefix + "snipe (#canal[opcional])",
            "Mira el último mensaje borrado",
            true
          )
          .addField(prefix + "rolelist", "Mira los roles del servidor", true)
          .addField(prefix + "emojilist", "Mira los emojis del servidor", true)
          .addField(
            prefix + "emoji-info (nombre)",
            "Mira la información de un emoji",
            true
          )
          .addField(
            prefix + "jumbo :emoji:",
            "Muestra una imagen de un emoji (solo del server)",
            true
          )
          .addField(
            prefix + "charcount (texto)",
            "Mira cuantos caracteres mide tu texto",
            true
          )
          .addField(
            prefix + "vote",
            "Links a los bot lists en donde estoy!",
            true
          )
          .addField(
            prefix + "inviteinfo [invite]",
            "Mira información de una invitación, puede ser discord.gg, discord.com/invite, o solo el code",
            true
          )
          .addField(
            prefix + "discordjs (búsqueda)",
            "Busca algo en las docs de discord.js",
            true
          )
          .addField(
            prefix +
              "traduce (lenguaje del texto) (lenguaje a traducir) (texto)",
            "Traduce de (lenguaje del texto) a (lenguaje a traducir): (texto)",
            true
          )
          .addField(
            prefix + "minecraft (IP de minecraft)",
            "Mira información de un server de minecraft",
            true
          )
          .addField(
            prefix + "structure (opcional mención)",
            "Muestra los canales del servidor, si un usuario es mencionado, saldrán los canales del servidor visibles para el usuario",
            true
          )
          .setColor("BLUE");
      }
      if (le == "english") {
        infoembed
          .setTitle("Information commands")
          .addField(prefix + "serverinfo", "Shows server info", true)
          .addField(
            prefix + "avatar",
            "Shows your avatar or someone else",
            true
          )
          .addField(prefix + "servericon", "Shows the server icon", true)
          .addField(
            prefix + "user (optional mention or ID)",
            "Shows user info",
            true
          )
          .addField(prefix + "ping", "Shows the bot latency", true)
          .addField(prefix + "stats", "Shows bot's stats", true)
          .addField(prefix + "lyrics (song)", "Shows lyrics of a song.", true)
          .addField(prefix + "invite", "Shows the bot invitation", true)
          .addField(
            prefix + "calculate/calc (operation)",
            "Calculates someting, simbols are + - * /",
            true
          )
          .addField(
            prefix + "covid (country)",
            "Shows information of ~~Covid-19~~ in a country",
            true
          )
          .addField(
            prefix + "playstore (app)",
            "Shows information about an application or a game.",
            true
          )
          .addField(
            prefix + "snipe (#channel[optional])",
            "Shows the last deleted message",
            true
          )
          .addField(prefix + "rolelist", "Shows the server roles", true)
          .addField(prefix + "emojilist", "Shows the server emojis", true)
          .addField(
            prefix + "emoji-info (name)",
            "Shows information about an emoji",
            true
          )
          .addField(
            prefix + "jumbo :emoji:",
            "Shows the emoji image (only server emojis)",
            true
          )
          .addField(
            prefix + "charcount (text)",
            "Shows how many characters has your text",
            true
          )
          .addField(prefix + "vote", "Links to the bot lists i am in!")
          .addField(
            prefix + "inviteinfo [invite]",
            "Shows information about an invite, can be discord.gg, discord.com/invite, or only the code",
            true
          )
          .addField(
            prefix + "discordjs (search)",
            "Search something in the discord.js docs",
            true
          )
          .addField(
            prefix + "traduce (text language) (language to traduce) (text)",
            "Translates from (text language) to (language to traduce): (text)"
          )
          .addField(
            prefix + "minecraft (Minecraft IP)",
            "Shows information about a minecraft server",
            true
          )
          .addField(
            prefix + "structure (optional mention)",
            "Shows the server channels, if a user is mentioned, the server channels visible to the user will appear"
          )
          .setColor("BLUE");
      }

      const ayuda = new MessageEmbed();
      if (le == "español") {
        ayuda
          .setTitle("Lista de categorías")
          .addField(prefix + "help/ayuda", "Esto! :smiley:")
          .addField(
            prefix + "moderation/reacciona a :no_entry:",
            "Muestra comandos de moderación"
          )
          .addField(
            prefix + "fun/reacciona a :rofl:",
            "Muestra comandos divertidos"
          )
          .addField(
            prefix + "info/reacciona a :information_source:",
            "Muestra comandos de información"
          )
          .addField(
            prefix + "support/reacciona a :question:",
            "Muestra comandos de soporte"
          )
          .addField(
            prefix + "notes/reacciona a :pencil2:",
            "Soy un bot de texto, no? Pues aquí están las notas!"
          )
          .addField(
            prefix + "economy/reacciona a :money_with_wings:",
            "Muestra comandos de economía"
          )
          .addField(
            "Reacciona a :leftwards_arrow_with_hook:",
            "Vuelves al panel de ayuda"
          )
          .addField(
            prefix + "no-categoria/reacciona a :face_with_raised_eyebrow:",
            "Muestra comandos sin una categoría"
          )
          .addField("Reacciona a :x:", "Borro este mensaje")
          .addField(
            ":partying_face: ANUNCIO :partying_face:",
            `Quieres un bot que tenga diversión y mas categorías?

Prueba a skormy! Un bot en progreso pero con comandos para divertirse, con skormy no te aburriras, ya que tiene demasiadas categorías que puedes descubrir, además de que tiene comandos secretos :o, mete a skormy y diviértete con el probando y descubriendo sus comandos!

Invitalo a tu server:
[link](https://top.gg/bot/779918057027665960)`
          )
          .addField(
            "IMPORTANTE :warning:",
            "Usa " +
              prefix +
              "tos para ver las condiciones de servicio, esto puede servirte si estás en la blacklist."
          )
          .setColor(exito_color);
      }
      if (le == "english") {
        ayuda
          .setTitle("Category list")
          .addField(prefix + "help/ayuda", "This! :smiley:")
          .addField(
            prefix + "moderation/react to :no_entry:",
            "Shows moderation commands"
          )
          .addField(prefix + "fun/react to :rofl:", "Shows fun commands")
          .addField(
            prefix + "info/react to :information_source:",
            "Shows information commands"
          )
          .addField(
            prefix + "support/react to :question:",
            "Shows support commands"
          )
          .addField(
            prefix + "notes/react to :pencil2:",
            "I am a TextBot, no? So here are note commands!"
          )
          .addField(
            prefix + "economy/reacciona a :money_with_wings:",
            "Shows economy commands"
          )
          .addField(
            "React to :leftwards_arrow_with_hook:",
            "goes back to the help panel"
          )
          .addField(
            prefix + "no-categoria/react to :face_with_raised_eyebrow:",
            "Shows non-categorized commands"
          )
          .addField("React to :x:", "I delete this message")
          .addField(
            ":partying_face: AD :partying_face:",
            `Bienvenido a DBSupport server, el Server del bot DBSupport :handshake: :sunglasses:
        ¿Quién es DBSupport?: DBSupport es un bot multifuncion, moderación, memes, embeds, diversión, economía, config, y mas!
        Únete usando [este link!](https://discord.gg/NeswjzwzYu)`
          )
          .addField(
            "IMPORTANT :warning:",
            "Use " +
              prefix +
              "tos to view the terms of service, this will help you if you are on the blacklist."
          )
          .setColor(exito_color);
      }

      const no = new MessageEmbed();
      if (le == "español") {
        no.setTitle("Comandos no categorizados")
          .addField(prefix + "say (texto)", "El bot dice lo que dices")
          .addField(
            prefix + "embedsay (texto)",
            "Un embed medio no profesional con tu texto"
          )
          .addField(
            prefix + "masterembed (titulo)|(descripcion)|(color)",
            "Un embed más profiesional"
          )
          .addField(
            prefix + "json-embed (JSON code)",
            "El embed más profesional, crea un embed a partir de JSON"
          )
          .setColor("WHITE");
      }
      if (le == "english") {
        no.setTitle("Non-categorized commands")
          .addField(prefix + "say (text)", "I say what you say")
          .addField(prefix + "embedsay (text)", "A non-professional embed")
          .addField(
            prefix + "masterembed (tite)|(description)|(color)",
            "A more professional embed"
          )
          .addField(
            prefix + "json-embed (JSON code)",
            "The most professional code"
          )
          .setColor("WHITE");
      }

      const cargando = new MessageEmbed();
      if (le == "español") {
        cargando
          .setTitle("Lista de categorías")
          .setDescription(
            "Se están añadiendo las reacciones\nEspere un momento..."
          )
          .setColor(exito_color);
      }
      if (le == "english") {
        cargando
          .setTitle("Category list")
          .setDescription("The reactions are being added\nPlease wait...")
          .setColor(exito_color);
      }

      let xd = await message.channel.send(cargando);
      await xd.react("⛔");
      xd.edit(cargando);
      await xd.react("🤣");
      xd.edit(cargando);
      await xd.react("ℹ️");
      xd.edit(cargando);
      await xd.react("❓");
      xd.edit(cargando);
      await xd.react("✏️");
      xd.edit(cargando);
      await xd.react("💸");
      xd.edit(cargando);
      await xd.react("↩️");
      xd.edit(cargando);
      await xd.react("🤨");
      xd.edit(cargando);
      await xd.react("❌");
      xd.edit(cargando);
      await xd.edit(ayuda);

      await xd.awaitReactions((reaction, user) => {
        if (message.author.id != user.id) return;

        if (reaction.emoji.name === "⛔") {
          if (permisos.has("MANAGE_MESSAGES")) reaction.users.remove(user.id);
          xd.edit(modembed);
        }
        if (reaction.emoji.name === "🤣") {
          if (permisos.has("MANAGE_MESSAGES")) reaction.users.remove(user.id);
          xd.edit(funembed);
        }
        if (reaction.emoji.name === "ℹ️") {
          if (permisos.has("MANAGE_MESSAGES")) reaction.users.remove(user.id);
          xd.edit(infoembed);
        }
        if (reaction.emoji.name === "❓") {
          if (permisos.has("MANAGE_MESSAGES")) reaction.users.remove(user.id);
          xd.edit(support);
        }
        if (reaction.emoji.name === "✏️") {
          if (permisos.has("MANAGE_MESSAGES")) reaction.users.remove(user.id);
          xd.edit(n);
        }
        if (reaction.emoji.name === "💸") {
          if (permisos.has("MANAGE_MESSAGES")) reaction.users.remove(user.id);
          xd.edit(eco);
        }
        if (reaction.emoji.name === "↩️") {
          if (permisos.has("MANAGE_MESSAGES")) reaction.users.remove(user.id);
          xd.edit(ayuda);
        }
        if (reaction.emoji.name === "🤨") {
          if (permisos.has("MANAGE_MESSAGES")) reaction.users.remove(user.id);
          xd.edit(no);
        }
        if (reaction.emoji.name === "❌") {
          xd.delete();
        }
      });
    }
    ////////////////////////////////////////////////COMANDO ASCII//////////////////////////////////////////////
    else if (command === "ascii") {
      let data = args.slice(1).join(" ");
      if (le == "español") {
        if (data.length > 15)
          return message.reply("Solo se permite hasta 15 carácteres.");
        if (!args.slice(1).join(" ")) return message.reply("Escribe algo.");
        figlet(data, (err, result) =>
          message.channel.send("```" + result + "```")
        );
      } else {
        if (data.length > 15) return message.reply("Maximum 15 characters.");
        if (!args.slice(1).join(" ")) return message.reply("Put some text.");
        figlet(data, (err, result) =>
          message.channel.send("```" + result + "```")
        );
      }
    }
    ///////////////////////////////////////////////COMANDO HOWGAY//////////////////////////////////////////////
    else if (command === "howgay") {
      let miembro =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[1]) ||
        message.guild.members.cache.get(m => m.name.startsWith(args[1])) ||
        message.member;

      if (re == "español" && !permisos.has("EMBED_LINKS"))
        return message.channel.send(
          `${miembro.user.username}, eres **${Math.floor(
            Math.random() * 100
          )}%** gay :rainbow_flag:`
        );
      else if (le == "español" && !permisos.has("EMBED_LINKS"))
        return message.channel.send(
          `${miembro.user.username}, you are **${Math.floor(
            Math.random() * 100
          )}%** gay :rainbow_flag:`
        );
      const gayembed = new MessageEmbed();
      if (le == "español") {
        gayembed
          .setTitle(`Porcentaje gay de ${miembro.user.username}`)
          .setDescription(
            `${miembro.user.username} es **${Math.floor(
              Math.random() * 100
            )}%** gay :rainbow_flag:`
          )
          .setColor("RANDOM");
      }
      if (le == "english") {
        gayembed
          .setTitle(`Gay percentage of ${miembro.user.username}`)
          .setDescription(
            `${miembro.user.username} is **${Math.floor(
              Math.random() * 100
            )}%** gay :rainbow_flag:`
          )
          .setColor("RANDOM");
      }
      message.channel.send(gayembed);
    }
    /////////////////////////////////////////////////COMANDO 8BALL//////////////////////////////////////////
    else if (command === "8ball") {
      try {
        let rpts;

        if (le == "español") {
          rpts = [
            "Sí",
            "No",
            "Tal vez",
            "No sé",
            "No voy a responder eso",
            "Por supuesto",
            "Por supuesto que no",
            "No lo creo",
            "E?",
            "No estoy muy seguro"
          ];
        } else if (le == "english") {
          rpts = [
            "Yes",
            "No",
            "Maybe",
            "I don't know",
            "I will not answer that",
            "Obvously",
            "Obvously not",
            "I don't think so",
            "E?",
            "I am not very sure"
          ];
        }

        if (!args[1]) {
          if (le == "español") return message.reply(`Escriba una pregunta.`);
          else return message.reply("Put some text");
        }

        let embed;
        if (le == "español") {
          embed = {
            embed: {
              title: "8ball! :8ball:",
              fields: [
                {
                  name: "Pregunta",
                  value: "```" + args.slice(1).join(" ") + "```"
                },
                {
                  name: "Respuesta",
                  value:
                    "```" +
                    rpts[Math.floor(Math.random() * rpts.length)] +
                    "```"
                }
              ],
              footer: { text: `Pedido por ${message.author.username}` }
            }
          };
        }
        if (le == "english") {
          embed = {
            embed: {
              title: "8ball! :8ball:",
              fields: [
                {
                  name: "Question",
                  value: "```" + args.slice(1).join(" ") + "```"
                },
                {
                  name: "Answer",
                  value: rpts[Math.floor(Math.random() * rpts.length)]
                }
              ],
              footer: {
                text: `Requested by ${message.author.username}`
              }
            }
          };
        }
        message.channel.send(embed);
      } catch (error) {
        if (le == "español") {
          message.channel.send("Escriba una pregunta");
          return;
        } else {
          message.channel.send("Put some question");
        }
      }
    }
    ////////////////////////////////////////////COMANDO PING//////////////////////////////////////////////////////
    else if (command === "ping") {
      const ping = new MessageEmbed();
      if (le == "español") {
        ping
          .setTitle("Pong!")
          .addField(
            ":incoming_envelope: Ping mensaje",
            Math.floor(Date.now() - message.createdTimestamp) + "ms"
          )
          .addField(
            ":satellite_orbital: Ping Discord API",
            client.ws.ping + "ms"
          )
          .setColor(exito_color);
      }
      if (le == "english") {
        ping
          .setTitle("Pong!")
          .addField(
            ":incoming_envelope: Message ping",
            Math.floor(Date.now() - message.createdTimestamp) + "ms"
          )
          .addField(
            ":satellite_orbital: Discord API Ping",
            client.ws.ping + "ms"
          )
          .setColor(exito_color);
      }
      message.channel.send(ping);
    } else if (command === "invite") {
      if (["765686719890194453"].includes(message.guild.id)) {
        if (le == "español")
          return message.channel.send(
            "Este comando está deshabilitado en este server!"
          );
        else
          return message.channel.send(
            "This command is disabled for this guild!"
          );
      }
      let embed;

      if (le == "español") {
        embed = {
          embed: {
            title: "Links que te pueden servir!",
            fields: [
              {
                name: ":inbox_tray: Invitarme",
                value:
                  "Puedes invitarme usando [este enlace](https://discord.com/oauth2/authorize?client_id=763042495655313479&scope=bot&permissions=37088350)"
              },
              {
                name: "<:soporte:787442668195414057> Server",
                value:
                  "Únete a mi server de soporte haciendo [click aquí!](https://discord.gg/shAnhwFA36)"
              }
            ],
            color: exito_color
          }
        };
      }
      if (le == "english") {
        embed = {
          embed: {
            title: "Links that you can use!",
            fields: [
              {
                name: ":inbox_tray: Invite me",
                value:
                  "You can invite me using [This link!](https://discord.com/oauth2/authorize?client_id=763042495655313479&scope=bot&permissions=37088342)"
              },
              {
                name: "<:soporte:787442668195414057> Server",
                value:
                  "Enter my support server clicking [here!](https://discord.gg/shAnhwFA36)"
              }
            ],
            color: exito_color
          }
        };
      }
      message.channel.send(embed);
    }
    ///////////////////////////////////////////////////////COMANDO SERVERICON/////////////////////////////////////////////////////////////
    else if (command === "servericon") {
      const thumb = message.guild.iconURL({
        format: "png",
        dynamic: true,
        size: 4096
      });
      if (!thumb) {
        if (le == "español")
          return message.channel.send("Este servidor no tiene ícono!");
        else return message.channel.send("This server does not have an icon!");
      }
      const serverembed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor("Server icon: " + message.guild.name + "")
        .setImage(
          message.guild.iconURL({ format: "png", dynamic: true, size: 4096 })
        )
        .setDescription(
          `[Icono URL](${message.guild.iconURL({
            format: "png",
            dynamic: true,
            size: 4096
          })})`
        )
        .setTimestamp();
      if (le == "english")
        serverembed.setDescription(
          `[Icon URL](${message.guild.iconURL({
            format: "png",
            dynamic: true,
            size: 4096
          })})`
        );

      message.channel.send(serverembed);
    }
    ///////////////////////////////////////////////////////COMANDO AVATAR/////////////////////////////////////////////////////////////////
    else if (command === "avatar") {
      let mention =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[1]) ||
        message.guild.members.cache.get(c => c.name.startsWith(args[1])) ||
        message.member;

      const avatarembed = new MessageEmbed();
      if (le == "español") {
        avatarembed
          .setColor(mention.displayColor)
          .setAuthor(
            "Avatar de " +
              mention.displayName +
              "#" +
              mention.user.discriminator
          )
          .setDescription(
            `[Avatar URL](${mention.user.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 4096
            })})`
          )
          .setImage(
            mention.user.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 4096
            })
          )
          .setTimestamp();
      } else {
        avatarembed
          .setColor(mention.displayColor)
          .setAuthor("Avatar of " + mention.displayName + "")
          .setDescription(
            `[Avatar URL](${mention.user.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 4096
            })})`
          )
          .setImage(
            mention.user.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 4096
            })
          )
          .setTimestamp();
      }
      message.channel.send(avatarembed);
    }
    ////////////////////////////////////////////////////////////COMANDO EMBEDSAY//////////////////////////////////////////////////////////////////////////////
    else if (command === "embedsay") {
      let verifLevels, region;

      if (le == "español") {
        (region = {
          europe: "Europa :flag_eu:",
          brazil: "Brasil :flag_br: ",
          hongkong: "Hong Kong :flag_hk:",
          japan: "Japón :flag_jp:",
          russia: "Rusia :flag_ru:",
          singapore: "Singapur :flag_sg:",
          southafrica: "Sudáfrica :flag_za:",
          sydney: "Sydney :flag_au:",
          "us-central": "Central US :flag_us:",
          "us-east": "Este US :flag_us:",
          "us-south": "Sur US :flag_us:",
          "us-west": "Oeste US :flag_us:",
          "vip-us-east": "VIP US Este :flag_us:",
          "eu-central": "Europa Central :flag_eu:",
          "eu-west": "Europa Oeste :flag_eu:",
          london: "London :flag_gb:",
          amsterdam: "Amsterdam :flag_nl:",
          india: "India :flag_in:"
        }),
          (verifLevels = {
            NONE: "Ninguno",
            LOW: "Bajo",
            MEDIUM: "Medio",
            HIGH: "Alto",
            VERY_HIGH: "Muy alto"
          });
      } else {
        (region = {
          europe: "Europe :flag_eu:",
          brazil: "Brazil :flag_br: ",
          hongkong: "Hong Kong :flag_hk:",
          japan: "Japan :flag_jp:",
          russia: "Russia :flag_ru:",
          singapore: "Singapore :flag_sg:",
          southafrica: "South Africa :flag_za:",
          sydney: "Sydney :flag_au:",
          "us-central": "Central US :flag_us:",
          "us-east": "East US :flag_us:",
          "us-south": "South US :flag_us:",
          "us-west": "West US :flag_us:",
          "vip-us-east": "VIP US East :flag_us:",
          "eu-central": "Europe Central :flag_eu:",
          "eu-west": "Europe West :flag_eu:",
          london: "London :flag_gb:",
          amsterdam: "Amsterdam :flag_nl:",
          india: "India :flag_in:"
        }),
          (verifLevels = {
            NONE: "None",
            LOW: "Low",
            MEDIUM: "Medium",
            HIGH: "High",
            VERY_HIGH: "Very high"
          });
      }
      const embed = new MessageEmbed();
      if (le == "español") {
        embed
          .setTitle("Hey")
          .setDescription(
            "No has dicho nada! aqui hay algunas alias que puedes usar si quieres:"
          )
          .addField("{user}", "Tu nombre de usuario")
          .addField("{server.name}", "El nombre del servidor")
          .addField("{server.id}", "La ID del servidor")
          .addField("{user.id}", "Tu ID")
          .addField("{user.avatar}", "Tu avatar URL")
          .addField("{server.icon}", "El ícono URL del servidor")
          .addField(
            "{server.verification}",
            "El nivel de verificación del servidor"
          )
          .addField("{server.region}", "La región del servidor")
          .setColor("#ff0000");
      } else {
        embed
          .setTitle("Hey!")
          .setDescription(
            "You didn't say nothing! Here are some alias you can use:"
          )
          .addField("{user}", "Your user name")
          .addField("{server.name}", "The server name")
          .addField("{server.id}", "The server ID")
          .addField("{user.id}", "Your ID")
          .addField("{user.avatar}", "Your avatar URL")
          .addField("{server.icon}", "The server's icon URL")
          .addField("{server.verification}", "The server verification level")
          .addField("{server.region}", "The server region")
          .setColor("#ff0000");
      }
      let say = args
        .slice(1)
        .join(" ")
        .replace("{user}", message.author.username)
        .replace("{server.name}", message.guild.name)
        .replace("{server.id}", message.guild.id)
        .replace("{user.id}", message.author.id)
        .replace(
          "{user.avatar}",
          message.author.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: ""
          })
        )
        .replace(
          "{server.icon}",
          message.guild.iconURL({ dynamic: true, format: "png", size: "" })
        )
        .replace(
          "{server.verification}",
          verifLevels[message.guild.verificationLevel]
        )
        .replace("{server.region}", region[message.guild.region]);

      if (!say || say == null) return message.channel.send(embed);
      if (message.deletable) message.delete();
      let links = [
        "https://",
        "www.",
        "web.",
        "http://",
        "discord.gg/",
        "discord.com/invite/",
        "discord.new/",
        "discord.com/oauth2"
      ];
      if (
        links.some(x => message.content.includes(x)) &&
        !message.member.permissions.has("MANAGE_GUILD")
      )
        return message.channel.send(
          "No puedes usar links en el say a menos de que tengas permisos de gestionar servidor!"
        );
      let s = new MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(say)
        .setColor("RANDOM");
      message.channel.send(s);

      /////////////////////////////////////////////////////////COMANDO SUGGEST/////////////////////////////////////////////////////////////////////
    } else if (command === "suggest") {
      if (!args.slice(1).join(" ")) {
        if (le == "español") return message.reply("Escribe algo para sugerir!");
        else return message.reply("Say something to suggest!");
      }
      const sugembed = new MessageEmbed()
        .setTitle("Nueva sugerencia desde: " + message.guild.name)
        .setDescription(args.slice(1).join(" "))
        .setAuthor(
          message.author.tag + " [" + message.author.id + "]",
          message.author.displayAvatarURL()
        )
        .setColor("BLUE")
        .setFooter(
          "⬆️ Me gusta! | ⬇️ No me gusta | ✅ Añadido | ❌ No se añadira | ⏰ Pendiente"
        );
      const m = await client.channels.cache
        .get("770438735719825439")
        .send(sugembed);
      m.react("⬆️");
      m.react("⬇️");
      if (le == "español")
        message.channel.send("Sugerencia enviada ! :white_check_mark:");
      else message.channel.send("Suggestion sent! :white_check_mark:");
    }
    /////////////////////////////////////////////////////////////////COMANDO SUPPORT////////////////////////////////////////////////////////////////
    else if (command === "discord") {
      if (["765686719890194453"].includes(message.guild.id)) {
        if (le == "español")
          return message.channel.send(
            "Este comando está deshabilitado en este server!"
          );
        else
          return message.channel.send(
            "This command is disabled for this guild!"
          );
      }
      const embed2 = new MessageEmbed();
      if (le == "español") {
        embed2
          .setTitle("Soporte")
          .addField(
            "Hey! Necesitas ayuda? o quieres unirte a mi server? Aquí esta!",
            "[Usa este enlace!](https://discord.gg/shAnhwFA36)"
          )
          .setTimestamp()
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setColor("YELLOW");
      } else {
        embed2
          .setTitle("Support")
          .addField(
            "Hey! You need help? or you want to join my server? Here it is!",
            "[Use this link!](https://discord.gg/shAnhwFA36)"
          )
          .setTimestamp()
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setColor("YELLOW");
      }
      message.channel.send(embed2);
    }
    //////////////////////////////////////////////////////////////////COMANDO MODERATION///////////////////////////////////////////////////////////////
    else if (command === "moderation") {
      const modembed = new MessageEmbed();
      if (le == "español") {
        modembed
          .setTitle("Comandos de moderación")
          .addField(
            prefix + "ban (@usuario) (razón)",
            "Banea a a alguien",
            true
          )
          .addField(
            prefix + "kick (@usuario) (razón)",
            "Expulsa a alguien.",
            true
          )
          .addField(prefix + "clear (1/100)", "Borra mensajes", true)
          .addField(
            prefix + "prefix (nuevo prefix)",
            "Cambia el prefix del bot!",
            true
          )
          .addField(
            prefix + "setwelcome (#canal)",
            "Configura el canal de bienvenidas.",
            true
          )
          .addField(
            prefix + "desactivate-welcome",
            "Desactiva las bienvenidas",
            true
          )
          .addField(
            prefix + "setcooldown (tiempo)",
            "Establece un modo pausado para el canal. [s = segundos/m = minutos/h = horas]",
            true
          )
          .addField(prefix + "hackban (ID)", "Banea a alguien por la ID", true)
          .addField(
            prefix + "backup <create**/**info (ID)**/**load (ID)>",
            "Crea, mira la info, o carga backups",
            true
          )
          .addField(
            prefix + "poll (#canal/pregunta/opcion1/opcion2)",
            "Crea una encuesta personalizada",
            true
          )
          .addField(
            prefix + "reactions <on|off>",
            "Si pones alguna palabra que esté en mi configuración y que no empieze con mi prefix, reaccionaré, puedes desactivar o activar esta configuración.",
            true
          )
          .addField(
            prefix + "lang (lenguaje)",
            "Literal esto le costó a mi creador (" +
              prefix +
              "stats) 5 días en traducir ._. Cambia el lenguaje del bot!"
          )
          .addField(
            prefix + "gstart (#canal/duracion/ganadores/premio)",
            "Comienza un giveaway",
            true
          )
          .addField(prefix + "gend (mensaje ID)", "Termina un giveaway", true)
          .addField(
            prefix + "greroll (mensaje ID)",
            "Rerollea un giveaway",
            true
          )
          .setColor("#ff0000");
      }
      if (le == "english") {
        modembed
          .setTitle("Moderation commands")
          .addField(
            prefix + "ban (@user) (reason)",
            "Bans mentioned user",
            true
          )
          .addField(
            prefix + "kick (@user) (reason)",
            "Kicks mentioned user.",
            true
          )
          .addField(prefix + "clear (1/100)", "Deletes messages", true)
          .addField(
            prefix + "prefix (new prefix)",
            "Change bot's prefix!",
            true
          )
          .addField(
            prefix + "setwelcome (#channel)",
            "Sets the welcome channel.",
            true
          )
          .addField(
            prefix + "desactivate-welcome",
            "Desactivates the welcome channel",
            true
          )
          .addField(
            prefix + "setcooldown (time)",
            "Sets a slowmode for the channel [s = seconds/m = minutes/h = hours]",
            true
          )
          .addField(prefix + "hackban (ID)", "Bans someone with the ID", true)
          .addField(
            prefix + "backup <create**/**info (ID)**/**load (ID)>",
            "Creates, view info, or loads backups",
            true
          )
          .addField(
            prefix + "poll (#channel/question/option1/option2)",
            "Creates a custom poll",
            true
          )
          .addField(
            prefix + "reactions <on|off>",
            "If you put some word that is in my configuration and that does not start with my prefix, I will react, you can deactivate or activate this configuration.",
            true
          )
          .addField(
            prefix + "lang (language)",
            "Literally this command tooks my owner (" +
              prefix +
              "stats) 5 days to traduce ._. Change the language of the bot!"
          )
          .addField(
            prefix + "gstart (#channel/duration/winners/prize)",
            "Starts a giveaway",
            true
          )
          .addField(prefix + "gend (message ID)", "Ends a giveaway", true)
          .addField(prefix + "greroll (message ID)", "Rerolls a giveaway", true)
          .setColor("#ff0000");
      }
      message.channel.send(modembed);
    }
    ////////////////////////////////////////////////////////////////////COMANDO FUN/////////////////////////////////////////////////////////////////
    else if (command === "fun") {
      const funembed = new MessageEmbed();
      if (le == "español") {
        funembed
          .setTitle("Comandos divertidos :zany_face:")
          .addField(prefix + "howgay", "Mira qué tan gay eres", true)
          .addField(prefix + "ascii", "Convierte tu texto a texto ascii", true)
          .addField(
            prefix + "8ball",
            "Pregunta algo y te contestaré con algo random",
            true
          )
          .addField(
            prefix + "slap (@usuario)",
            "Le das una cachetada a alguien",
            true
          )
          .addField(
            prefix + "chat (texto)",
            "Chateas con el bot en todos los lenguajes!",
            true
          )
          .addField(prefix + "meme", "Meme random", true)
          .addField(
            prefix + "ppt [piedra/papel/tijera]",
            "Juega a piedra papel o tijera",
            true
          )
          .addField(
            prefix + "trump (mensaje)",
            "Imagen de trump mostrando tu mensaje",
            true
          )
          .addField(
            prefix + "imgsearch (búsqueda)",
            "Busca imágenes en internet",
            true
          )
          .addField(
            prefix + "mirror (opcional mención o ID)",
            "Muestra lo que más quieres en este mundo y el avatar"
          )
          .setColor(exito_color);
      }
      if (le == "english") {
        funembed
          .setTitle("Fun commands :zany_face:")
          .addField(prefix + "howgay", "Show how gay are you", true)
          .addField(prefix + "ascii", "Converts your text to ASCII text", true)
          .addField(
            prefix + "8ball",
            "Ask something and i will reply with something random",
            true
          )
          .addField(prefix + "slap (@user)", "You slap someone", true)
          .addField(prefix + "chat (texto)", "Chat with the bot!", true)
          .addField(prefix + "meme", "Random meme", true)
          .addField(
            prefix + "ppt [rock/paper/scissors]",
            "Play rock paper or scissors",
            true
          )
          .addField(
            prefix + "trump (message)",
            "Trump image showing your message",
            true
          )
          .addField(
            prefix + "imgsearch (search)",
            "Search images on internet",
            true
          )
          .addField(
            prefix + "mirror (opcional mention or ID)",
            "Shows what you want most in this world and the avatar (spanish)",
            true
          )
          .setColor(exito_color);
      }
      message.channel.send(funembed);
    }
    ////////////////////////////////////////////////////////////////////COMANDO INFO///////////////////////////////////////////////////////////////
    else if (command === "info") {
      const infoembed = new MessageEmbed();
      if (le == "español") {
        infoembed
          .setTitle("Comandos de info")
          .addField(prefix + "serverinfo", "Muestra info del servidor", true)
          .addField(
            prefix + "avatar",
            "Muestra el avatar tuyo o el de otro",
            true
          )
          .addField(prefix + "servericon", "Muestra el ícono del server", true)
          .addField(
            prefix + "user (opcional mención o ID)",
            "Muestra información del usuario",
            true
          )
          .addField(prefix + "ping", "Muestra la latencia del bot", true)
          .addField(prefix + "stats", "Mira las estadísticas del bot", true)
          .addField(
            prefix + "lyrics (canción)",
            "Mira la letra de una canción.",
            true
          )
          .addField(prefix + "invite", "Muestra la invitación del bot", true)
          .addField(
            prefix + "calculate/calc (operación)",
            "Calcula algo, los simbolos son + - * /",
            true
          )
          .addField(
            prefix + "covid (pais)",
            "Muestra la información del ~~Covid-19~~ de un país (debe ser en ingles)",
            true
          )
          .addField(
            prefix + "playstore (app)",
            "Obtiene información de una aplicación o un juego.",
            true
          )
          .addField(
            prefix + "snipe (#canal[opcional])",
            "Mira el último mensaje borrado",
            true
          )
          .addField(prefix + "rolelist", "Mira los roles del servidor", true)
          .addField(prefix + "emojilist", "Mira los emojis del servidor", true)
          .addField(
            prefix + "emoji-info (nombre)",
            "Mira la información de un emoji",
            true
          )
          .addField(
            prefix + "jumbo :emoji:",
            "Muestra una imagen de un emoji (solo del server)",
            true
          )
          .addField(
            prefix + "charcount (texto)",
            "Mira cuantos caracteres mide tu texto",
            true
          )
          .addField(
            prefix + "vote",
            "Links a los bot lists en donde estoy!",
            true
          )
          .addField(
            prefix + "inviteinfo [invite]",
            "Mira información de una invitación, puede ser discord.gg, discord.com/invite, o solo el code",
            true
          )
          .addField(
            prefix + "discordjs (búsqueda)",
            "Busca algo en las docs de discord.js",
            true
          )
          .addField(
            prefix +
              "traduce (lenguaje del texto) (lenguaje a traducir) (texto)",
            "Traduce de (lenguaje del texto) a (lenguaje a traducir): (texto)",
            true
          )
          .addField(
            prefix + "minecraft (IP de minecraft)",
            "Mira información de un server de minecraft",
            true
          )
          .addField(
            prefix + "structure (opcional mención)",
            "Muestra los canales del servidor, si un usuario es mencionado, saldrán los canales del servidor visibles para el usuario",
            true
          )
          .setColor("BLUE");
      }
      if (le == "english") {
        infoembed
          .setTitle("Information commands")
          .addField(prefix + "serverinfo", "Shows server info", true)
          .addField(
            prefix + "avatar",
            "Shows your avatar or someone else",
            true
          )
          .addField(prefix + "servericon", "Shows the server icon", true)
          .addField(
            prefix + "user (optional mention or ID)",
            "Shows user info",
            true
          )
          .addField(prefix + "ping", "Shows the bot latency", true)
          .addField(prefix + "stats", "Shows bot's stats", true)
          .addField(prefix + "lyrics (song)", "Shows lyrics of a song.", true)
          .addField(prefix + "invite", "Shows the bot invitation", true)
          .addField(
            prefix + "calculate/calc (operation)",
            "Calculates someting, simbols are + - * /",
            true
          )
          .addField(
            prefix + "covid (country)",
            "Shows information of ~~Covid-19~~ in a country",
            true
          )
          .addField(
            prefix + "playstore (app)",
            "Shows information about an application or a game.",
            true
          )
          .addField(
            prefix + "snipe (#channel[optional])",
            "Shows the last deleted message",
            true
          )
          .addField(prefix + "rolelist", "Shows the server roles", true)
          .addField(prefix + "emojilist", "Shows the server emojis", true)
          .addField(
            prefix + "emoji-info (name)",
            "Shows information about an emoji",
            true
          )
          .addField(
            prefix + "jumbo :emoji:",
            "Shows the emoji image (only server emojis)",
            true
          )
          .addField(
            prefix + "charcount (text)",
            "Shows how many characters has your text",
            true
          )
          .addField(prefix + "vote", "Links to the bot lists i am in!")
          .addField(
            prefix + "inviteinfo [invite]",
            "Shows information about an invite, can be discord.gg, discord.com/invite, or only the code",
            true
          )
          .addField(
            prefix + "discordjs (search)",
            "Search something in the discord.js docs",
            true
          )
          .addField(
            prefix + "traduce (text language) (language to traduce) (text)",
            "Translates from (text language) to (language to traduce): (text)"
          )
          .addField(
            prefix + "minecraft (Minecraft IP)",
            "Shows information about a minecraft server",
            true
          )
          .addField(
            prefix + "structure (optional mention)",
            "Shows the server channels, if a user is mentioned, the server channels visible to the user will appear"
          )
          .setColor("BLUE");
      }
      message.channel.send(infoembed);
    }

    /////////////////////////////////////////////////////////////////////COMANDO SUPPORT/////////////////////////////////////////////////////////////
    else if (command === "support") {
      const support = new MessageEmbed();
      if (le == "español") {
        support
          .setTitle("Comandos de soporte")
          .addField(prefix + "discord", "Link a mi servidor de soporte")
          .addField(prefix + "suggest", "Sugiere algo para el bot")
          .addField(prefix + "bugreport (mensaje)", "Reporta un bug del bot")
          .setColor("#ff0000");
      }
      if (le == "english") {
        support
          .setTitle("Support commands")
          .addField(prefix + "discord", "Link to my support server")
          .addField(prefix + "suggest", "Suggest something of the bot")
          .addField(prefix + "bugreport (message)", "Report a bug of the bot")
          .setColor("#ff0000");
      }
      message.channel.send(support);
    }
    /////////////////////////////////////////////////////////////////COMANDO BUGREPORT///////////////////////////////////////////////////////////////
    else if (command === "bugreport") {
      let bug = "no";
      if (bug == "si") {
        if (le == "español")
          return message.channel.send("Temporalmente deshabilitado!");
        else return message.channel.send("Temporary disabled!");
      }
      if (!args.slice(1).join(" ")) {
        if (le == "español") return message.reply("Que bug tengo?");
        else return message.reply("What bug do i have?");
      }
      const bugembed = new MessageEmbed()
        .setTitle("Nuevo bug")
        .addField("Error:", args.slice(1).join(" "))
        .addField("Reportero:", message.author.tag)
        .setColor("#ff0000")
        .setTimestamp();
      client.users.resolve("761404868460019732").send(bugembed);
      if (le == "español")
        message.channel.send(
          "Gracias por tu reporte, ! PEPE#8888 lo verá lo antes posible!"
        );
      else
        message.channel.send(
          "Thanks for your bug! ! PEPE#8888 will take care of it!"
        );
    }

    /////////////////////////////////////////////////////////////COMANDO SLAP///////////////////////////////////////////////////////////////////////
    else if (command === "slap") {
      let memes = [
        "https://i.imgur.com/YA7g7h7.gif",
        "https://i.imgur.com/4MQkDKm.gif",
        "https://i.imgur.com/fm49srQ.gif",
        "https://cdn.zerotwo.dev/SLAP/cf972400-4ce4-4a3a-8fbf-33d1bc5f142f.gif",
        "https://cdn.nekos.life/slap/slap_012.gif",
        "https://cdn.nekos.life/slap/slap_010.gif",
        "https://media1.tenor.com/images/b6d8a83eb652a30b95e87cf96a21e007/tenor.gif?itemid=10426943",
        "https://i.imgur.com/o2SJYUS.gif",
        "https://media1.tenor.com/images/0720ffb69ab479d3a00f2d4ac7e0510c/tenor.gif"
      ];
      let math = memes[Math.floor(Math.random() * memes.length)];

      let miembro = message.mentions.members.first();
      if (!miembro) {
        if (le == "español")
          return message.channel.send(
            "Menciona a alguien para darle una cachetada."
          );
        else return message.reply("Mention someone to slap");
      }
      const slapembed = new MessageEmbed()
        .setTitle(
          `${message.author.username} le dio una cachetada a ${miembro.user.username} :0`
        )
        .setImage(math)
        .setFooter("XD")
        .setColor("RANDOM");
      if (le == "english") {
        slapembed.setTitle(
          `${message.author.username} just slapped to ${miembro.user.username} :0`
        );
      }
      message.channel.send(slapembed);
    }
    ///////////////////////////////////////////////////////////COMANDO LYRICS//////////////////////////////////////////////////////////////////////
    else if (command === "lyrics") {
      const search = args.slice(1).join(" ");

      if (!search) {
        if (le == "español")
          return message.channel.send("Escribe alguna canción!");
        else return message.channel.send("Please input some song!");
      }
      message.channel.startTyping();
      const [lyrics, icon, title, author] = await Promise.all([
        // array de promesas a resolver
        soleno.requestLyricsFor(search),
        soleno.requestIconFor(search),
        soleno.requestTitleFor(search),
        soleno.requestAuthorFor(search)
      ]);
      // créamos el embed básico
      const embed4 = new MessageEmbed()
        .setTitle(title)
        .setAuthor(author, icon)
        .setColor("BLUE");

      // Util.splitMessage() nos permitirá no superar el límite de caracteres de Discord
      // (ésta función la dá Discord.js)
      // iteramos sobre el array de mensajes a enviar
      for (const song of Util.splitMessage(lyrics)) {
        // ponemos en el footer el resultado y enviamos el embed
        embed4.setFooter(song);

        message.channel.send(embed4);
        // ésto por si la canción es muy larga :(
        message.channel.stopTyping();
      }
    } else if (command === "kick") {
      if (
        ["762599129443467294", "739811956638220298"].includes(message.guild.id)
      ) {
        if (le == "español")
          return message.channel.send(
            "Los comandos de moderación están deshabilitados en este server!"
          );
        else
          return message.channel.send(
            "Moderation commmands are disabled on this server!"
          );
      }
      if (!message.guild.me.permissions.has("KICK_MEMBERS")) {
        if (le == "español")
          return message.channel.send(
            "Necesito el permiso de expulsar para continuar"
          );
        else return message.reply("I need kick permissions to continue!");
      }

      if (!message.member.permissions.has("KICK_MEMBERS")) {
        {
          if (le == "español")
            return message.channel.send(
              "No tienes el permiso siguiente: `Expulsar`."
            );
          else return message.channel.send("You need kick permissions!");
        }
      }

      let persona =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[1]);

      if (!persona) {
        {
          if (le == "español")
            return message.channel.send("Debes mencionar a alguien");
          else return message.channel.send("You have to mention someone!");
        }
      } else if (!persona.kickable) {
        if (le == "español")
          return message.channel.send(
            "Esa persona/bot tiene un rol igual o más alto que el mío! :sweat:"
          );
        else
          return message.channel.send(
            "That person/bot has an equal or higher role! :sweat:"
          );
      } else if (
        persona.roles.highest.comparePositionTo(message.member.roles.highest) >
        0
      ) {
        if (le == "español")
          return message.channel.send(
            "Esta persona esta en la misma o mayor nivel de jerarquia que tu, no puedes expulsarlo"
          );
        else
          return message.channel.send(
            "That person has an equal or higher role than you! You can't kick they!"
          );
      }

      var razon = args.slice(2).join(" ");
      if (!razon) {
        if (le == "español") razon = "Razon no especificada";
        else razon = "Reason not provided";
      }
      var razon2 = `${message.author.tag}: ${razon}`;

      message.guild.member(persona).kick(razon2);
      let embed;

      if (le == "español")
        embed = {
          embed: {
            title: "Expulsado con éxito! ✅",
            color: exito_color,
            fields: [
              {
                name: "Expulsado:",
                value: `${persona.user.username}`,
                inline: true
              },
              {
                name: "Expulsador:",
                value: `<@${message.author.id}>`,
                inline: true
              },
              {
                name: "Razón:",
                value: `${razon}`,
                inline: true
              }
            ]
          }
        };
      else
        embed = {
          embed: {
            title: "Kicked successfully! ✅",
            color: exito_color,
            fields: [
              {
                name: "Kicked:",
                value: `${persona.user.username}`,
                inline: true
              },
              {
                name: "Moderator:",
                value: `<@${message.author.id}>`,
                inline: true
              },
              {
                name: "Reason:",
                value: `${razon}`,
                inline: true
              }
            ]
          }
        };

      message.channel.send(embed);
    } else if (
      command === "user" ||
      command === "userinfo" ||
      command === "ui"
    ) {
      const member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[1]) ||
        message.guild.members.cache.get(c => c.name.startsWith(args[1])) ||
        message.member;

      if (le == "español") {
        function formatDate(template, date) {
          var specs = "YYYY:MM:DD:HH:mm:ss".split(":");
          date = new Date(
            date || Date.now() - new Date().getTimezoneOffset() * 6e4
          );
          return date
            .toISOString()
            .split(/[-:.TZ]/)
            .reduce(function(template, item, i) {
              return template.split(specs[i]).join(item);
            }, template);
        }
        let estado = {
          online: "<a:Online:787442640438296627> Conectado",
          idle: "<:Idle:787442640945414255> Ausente",
          dnd: "<a:dnd:770747805106831360> No molestar",
          offline: "<a:Offline:787442642383536138> Desconectado"
        };
        const embed = new MessageEmbed()

          .setColor("RANDOM")
          .setTitle("Información del usuario: " + member.user.username)
          .addField("**#️⃣ Nombre**:", "**" + `${member.user.tag}` + "**")
          .addField("**🆔 ID**:", `${member.user.id}`)
          .addField(
            "**📌 Apodo**:",
            `${member.nickname !== null ? `${member.nickname}` : "Ninguno"}`,
            true
          )
          .addField(
            "**📥 Fecha de Ingreso al Servidor:**",
            formatDate("DD/MM/YYYY, a las HH:mm:ss", member.joinedAt)
          )
          .addField(
            "**✨ Cuenta Creada:**",
            formatDate("DD/MM/YYYY, a las HH:mm:ss", member.user.createdAt)
          )
          .addField(
            "**🏳️ Insignias:**",
            member.user.flags.toArray().length
              ? member.user.flags
                  .toArray()
                  .join(", ")
                  .replace(
                    "HOUSE_BRILLIANCE",
                    "<:brilliance:787442667118002203>"
                  )
                  .replace("HOUSE_BRAVERY", "<:bravery:787442669445447711>")
                  .replace("HOUSE_BALANCE", "<:balance:787442653147037748>")
                  .replace(
                    "EARLY_SUPPORTER",
                    "<:partidario_inicial:787442652269903872>"
                  )
                  .replace(
                    "DISCORD_EMPLOYEE",
                    "<:discord_employee:787442650651164692>"
                  )
                  .replace(
                    "DISCORD_PARTNER",
                    "<:discord_partner:787442654295490602>"
                  )
                  .replace(
                    "HYPESQUAD_EVENTS",
                    "<a:hypesquad_events:787442653717069856>"
                  )
                  .replace(
                    "BUG_HUNTER_LEVEL_1",
                    "<:bug_hunter_1:787442655583272960>"
                  )
                  .replace(
                    "BUG_HUNTER_LEVEL_2",
                    "<:bug_hunter_2:787442651154350112>"
                  )
                  .replace(
                    "VERIFIED_DEVELOPER",
                    "<:developer:778943805138665514>"
                  )
                  .replace("VERIFIED_BOT", "<:verified_bot:787442651465121833>")
              : "Ninguna"
          )
          .addField(
            "**🎮  Jugando**:",
            member.user.presence.game != null
              ? member.user.presence.game.name
              : "Nada",
            true
          )
          .addField(
            "**🎖 Roles:**",
            member.roles.cache.map(roles => `\`${roles.name}\``).join(", ")
          )
          .addField(
            "**🎨 Estado**:",
            "**" + estado[member.user.presence.status] + "**"
          )
          .addField(
            "**<a:NitroBoost:787442671136014346> Boostea este servidor**:",
            member.premiumSince ? "**Si**" : "**No**"
          )
          .addField(
            "🔰 Permisos",
            message.member.permissions
              .toArray()
              .join(" **|** ")
              .replace("CREATE_INSTANT_INVITE", "Crear invitacion")
              .replace("KICK_MEMBERS", "Expulsar")
              .replace("BAN_MEMBERS", "Banear")
              .replace("ADMINISTRATOR", "Administrador")
              .replace("MANAGE_CHANNELS", "Gestionar canales")
              .replace("MANAGE_GUILD", "Gestionar servidor")
              .replace("ADD_REACTIONS", "Añadir reacciones")
              .replace("VIEW_AUDIT_LOG", "Ver el registo")
              .replace("PRIORITY_SPEAKER", "Prioridad de palabra")
              .replace("STREAM", "Transmitir")
              .replace("VIEW_CHANNEL", "Ver canales")
              .replace("SEND_MESSAGES", "Enviar mensajes")
              .replace("SEND_TTS_MESSAGES", "Enviar mensajes de voz")
              .replace("MANAGE_MESSAGES", "Gestionar mensajes")
              .replace("EMBED_LINKS", "Insertar enlaces (embeds)")
              .replace("ATTACH_FILES", "Adjuntar archivos")
              .replace("READ_MESSAGE_HISTORY", "Leer el historial de mensajes")
              .replace("MENTION_EVERYONE", "Mencionar everyone y here")
              .replace("USE_EXTERNAL_EMOJIS", "Emojis externos")
              .replace("VIEW_GUILD_INSIGHTS", "Ver info del server")
              .replace("CONNECT", "Conectarse")
              .replace("SPEAK", "Hablar")
              .replace("MUTE_MEMBERS", "Silenciar")
              .replace("USE_VAD", "Detección de prioridad de palabra")
              .replace("DEAFEN_MEMBERS", "Ensordecer")
              .replace("MOVE_MEMBERS", "Mover")
              .replace("CHANGE_NICKNAME", "Cambiar apodo")
              .replace("MANAGE_NICKNAMES", "Gestionar apodos")
              .replace("MANAGE_ROLES", "Gestionar roles")
              .replace("MANAGE_WEBHOOKS", "Gestionar webhooks")
              .replace("MANAGE_EMOJIS", "Gestionar emojis")
          )
          .setThumbnail(
            member.user.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 1024
            })
          )
          .setFooter(
            `${message.author.username}`,
            `${message.author.displayAvatarURL()}`
          ); //nombre y avatar del usuario en el footer
        if (member.user.bot)
          embed.setTitle("Información del bot: " + member.user.username);

        message.channel.send(embed);
      } else {
        function formatDate(template, date) {
          var specs = "YYYY:MM:DD:HH:mm:ss".split(":");
          date = new Date(
            date || Date.now() - new Date().getTimezoneOffset() * 6e4
          );
          return date
            .toISOString()
            .split(/[-:.TZ]/)
            .reduce(function(template, item, i) {
              return template.split(specs[i]).join(item);
            }, template);
        }
        let estado = {
          online: "<a:Online:787442640438296627> Online",
          idle: "<:Idle:787442640945414255> Idle",
          dnd: "<a:dnd:770747805106831360> Do not Disturb",
          offline: "<a:Offline:787442642383536138> Offline"
        };

        const embed = new MessageEmbed()

          .setColor("RANDOM")
          .setTitle("Information of user: " + member.user.username)
          .addField("**#️⃣ Name**:", "**" + `${member.user.tag}` + "**")
          .addField("**🆔 ID**:", `${member.user.id}`)
          .addField(
            "**📌 Nickname**:",
            `${member.nickname !== null ? member.nickname : "None"}`,
            true
          )
          .addField(
            "**📥 Joined server:**",
            formatDate("DD/MM/YYYY, at HH:mm:ss", member.joinedAt)
          )
          .addField(
            "**✨ Account Created:**",
            formatDate("DD/MM/YYYY, at HH:mm:ss", member.user.createdAt)
          )
          .addField(
            "**🏳️ Flags:**",
            member.user.flags.toArray().length < 1
              ? "Ninguna"
              : member.user.flags
                  .toArray()
                  .join(", ")
                  .replace(
                    "HOUSE_BRILLIANCE",
                    "<:brilliance:787442667118002203>"
                  )
                  .replace("HOUSE_BRAVERY", "<:bravery:787442669445447711>")
                  .replace("HOUSE_BALANCE", "<:balance:787442653147037748>")
                  .replace(
                    "EARLY_SUPPORTER",
                    "<:partidario_inicial:787442652269903872>"
                  )
                  .replace(
                    "DISCORD_EMPLOYEE",
                    "<:discord_employee:787442650651164692>"
                  )
                  .replace(
                    "DISCORD_PARTNER",
                    "<:discord_partner:787442654295490602>"
                  )
                  .replace(
                    "HYPESQUAD_EVENTS",
                    "<a:hypesquad_events:787442653717069856>"
                  )
                  .replace(
                    "BUG_HUNTER_LEVEL_1",
                    "<:bug_hunter_1:787442655583272960>"
                  )
                  .replace(
                    "BUG_HUNTER_LEVEL_2",
                    "<:bug_hunter_2:787442651154350112>"
                  )
                  .replace(
                    "VERIFIED_DEVELOPER",
                    "<:developer:778943805138665514>"
                  )
                  .replace("VERIFIED_BOT", "<:verified_bot:787442651465121833>")
          )
          .addField(
            "**🎮  Playing**:",
            member.user.presence.game != null
              ? member.user.presence.game.name
              : "Nothing",
            true
          )
          .addField(
            "**🎖 Roles:**",
            member.roles.cache.map(roles => `\`${roles.name}\``).join(", ")
          )
          .addField(
            "**🎨 Status**:",
            "**" + estado[member.user.presence.status] + "**"
          )
          .addField(
            "**<a:NitroBoost:787442671136014346> Booster**:",
            member.premiumSince ? "**Yes**" : "**No**"
          )
          .addField(
            "🔰 Permissions",
            message.member.permissions
              .toArray()
              .join(" **|** ")
              .replace("CREATE_INSTANT_INVITE", "Create invite")
              .replace("KICK_MEMBERS", "Kick")
              .replace("BAN_MEMBERS", "Ban")
              .replace("ADMINISTRATOR", "Administrator")
              .replace("MANAGE_CHANNELS", "Manage channels")
              .replace("MANAGE_GUILD", "Manage server")
              .replace("ADD_REACTIONS", "Add reactions")
              .replace("VIEW_AUDIT_LOG", "View the registry")
              .replace("PRIORITY_SPEAKER", "Priority speaker")
              .replace("STREAM", "Stream")
              .replace("VIEW_CHANNEL", "View channels")
              .replace("SEND_MESSAGES", "Send messages")
              .replace("SEND_TTS_MESSAGES", "Send voice messages")
              .replace("MANAGE_MESSAGES", "Manage messages")
              .replace("EMBED_LINKS", "Insert links (embeds)")
              .replace("ATTACH_FILES", "Attach files")
              .replace("READ_MESSAGE_HISTORY", "View the message history")
              .replace("MENTION_EVERYONE", "Mention @everyone and @here")
              .replace("USE_EXTERNAL_EMOJIS", "Use external emojis")
              .replace("VIEW_GUILD_INSIGHTS", "View server information")
              .replace("CONNECT", "Connect")
              .replace("SPEAK", "Speak")
              .replace("MUTE_MEMBERS", "Mute members")
              .replace("USE_VAD", "Use VAD")
              .replace("DEAFEN_MEMBERS", "Deafen members")
              .replace("MOVE_MEMBERS", "Move members")
              .replace("CHANGE_NICKNAME", "Change nickames")
              .replace("MANAGE_NICKNAMES", "Manage nicknames")
              .replace("MANAGE_ROLES", "Manage roles")
              .replace("MANAGE_WEBHOOKS", "Manage webhooks")
              .replace("MANAGE_EMOJIS", "Manage emojis")
          )
          .setThumbnail(
            member.user.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 1024
            })
          )
          .setFooter(
            `${message.author.username}`,
            `${message.author.displayAvatarURL()}`
          ); //nombre y avatar del usuario en el footer
        if (member.user.bot)
          embed.setTitle("Information of bot: " + member.user.username);

        message.channel.send(embed);
      }
    }
    ///////////////////////////////////////////////////////////COMANDO CALC///////////////////////////////////////////
    else if (command === "calculate" || command === "calc") {
      const math = require("math-expression-evaluator"); // Este NPM es con el que se podrá hacer los calculos

      const embedl = new MessageEmbed().setColor(`RANDOM`);

      if (!args.slice(1).join(" ")) {
        if (le == "español")
          embedl.setDescription(
            "Escribe alguna **expresión**! ej: 1+1 | 1-1 | 1/1 | 1*1"
          );
        else
          embedl.setDescription(
            "Type any **expresion**! e.g: 1+1 | 1-1 | 1/1 | 1*1"
          );
        return await message.channel.send(embedl); // Devuelve un mensaje si es que ejecuta el comando sin nada
      }
      let resultado;
      try {
        resultado = math.eval(args.slice(1).join(" ")); // El Args toma el calculo
      } catch (err) {
        if (le == "español") resultado = "Error: Entrada Invalida";
        else resultado = "Error: Invalid input";
      }
      if (le == "español")
        embedl
          .addField(
            "Entrada:",
            `\`\`\`js\n${args.slice(1).join(" ")}\`\`\``,
            false
          ) // Te da el calculo
          .setTitle("📊 Calculadora")
          .addField("Salida", `\`\`\`js\n${resultado}\`\`\``, false);
      else
        embedl
          .setTitle("📊 Calculator")
          .addField(
            "Input:",
            `\`\`\`js\n${args.slice(1).join(" ")}\`\`\``,
            false
          )
          .addField("Output:", `\`\`\`js\n${resultado}\`\`\``);
      await message.channel.send(embedl);
    } else if (command === "chat") {
      if (!args.slice(1).join(" ")) {
        if (le == "español") return message.reply("Escribe algo!");
        else return message.reply("Type something!");
      }

      message.channel.startTyping();

      const response = await fetch(
        `https://some-random-api.ml/chatbot?message=${encodeURIComponent(
          args.slice(1).join(" ")
        )}`
      );

      const json = await response.json();

      if (json.error) return message.channel.send("Un error ha ocurrido!");

      message.channel.send(json.response);

      return message.channel.stopTyping(true);
    } else if (command === "covid") {
      let pais = args.slice(1).join(" "); // Es dÃ³nde escribiremos el Nombre del pais a buscar
      if (!pais) {
        if (le == "español")
          return message.channel.send(
            "¡Escribe el nombre de un país! Debe ser en inglés."
          );
        else return message.reply("Type any country name!");
      }

      superagent
        .get(`https://corona.lmao.ninja/v2/countries/${pais}`) // Con el NPM, "superagent", buscamos en la pÃ¡gina, la informaciÃ³n del pais sobre el covid-19.
        .end((err, res) => {
          let body = res.body;

          if (body.message) {
            if (le == "español")
              return message.channel.send(
                "¡El nombre del pais es invalido! Recuerda que el nombre debe ser en ingles."
              );
            else return message.reply("Invalid country name!");
          } // Si no encuentra el nombre retorna mensaje que no lo encontro.

          const embed = new MessageEmbed();
          if (le == "español") {
            embed
              .setAuthor("Casos del pais " + pais)
              .addField("**Casos Totales**", `${body.cases}`, true) // Casos totales de ese pais
              .addField("**Casos Críticos**", `${body.critical}`, true) // Casos criticos de ese pais
              .addField("**Casos Hoy**", `${body.todayCases}`, true) // Casos de "HOY" de ese pais
              .addField("**Muertes Totales**", `${body.deaths}`, true) // Muertes por el COVID-19 de ese pais
              .addField("**Muertes Hoy**", `${body.todayDeaths}`, true) // Muertes de hoy por el COVID-19 ese pais
              .addField("**Recuperados**", `${body.recovered}`, true) // Recuperados del COVID-19
              .addField(
                "**Medidas de Prevención**",
                `🧼👏 Lavarse las manos frecuentemente 
            🧴 Usar Alcohol
            🤧 Para Toser o estornudar usar un pañuelo 
            🧍↔️🧍 Evitar contacto directo de personas con sintoma de Tos y Gripe
            😷 Usar  Barbijo en público
            🔬 Intenta hacerte el test
            🏠 Quedarse en Casa`,
                true
              )
              .setTimestamp()
              .setColor("#ff0000")
              .setFooter(
                "#QuedateEnCasa",
                "https://fems-microbiology.org/wp-content/uploads/2020/03/2019-nCoV-CDC-23312_without_background-pubic-domain.png"
              )
              .setThumbnail(
                `https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSAxhpv5t94TvcZcKjDUlAsQvnubWFSoXKjsA&usqp=CAU`
              );
          } else {
            embed
              .setAuthor("Cases of country " + pais)
              .addField("**Total cases**", `${body.cases}`, true) // Casos totales de ese pais
              .addField("**Critical cases**", `${body.critical}`, true) // Casos criticos de ese pais
              .addField("**Cases today**", `${body.todayCases}`, true) // Casos de "HOY" de ese pais
              .addField("**Total deaths**", `${body.deaths}`, true) // Muertes por el COVID-19 de ese pais
              .addField("**Deaths today**", `${body.todayDeaths}`, true) // Muertes de hoy por el COVID-19 ese pais
              .addField("**Cured**", `${body.recovered}`, true) // Recuperados del COVID-19
              .addField(
                "**Preventive measures**",
                `🧼👏 Wash your hands frecuently 
            🧴 Use Alcohol
            🤧 Use a handkerchief when coughing 
            🧍↔️🧍 Avoid direct contact of people with symptoms of Cough and Flu
            😷 Use chinstrap
            🔬 Try to take the test
            🏠 Stay home`,
                true
              )
              .setTimestamp()
              .setColor("#ff0000")
              .setFooter(
                "#StayAtHome",
                "https://fems-microbiology.org/wp-content/uploads/2020/03/2019-nCoV-CDC-23312_without_background-pubic-domain.png"
              )
              .setThumbnail(
                `https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSAxhpv5t94TvcZcKjDUlAsQvnubWFSoXKjsA&usqp=CAU`
              );
          }
          message.channel.send(embed); // Envia toda la informaciÃ³n del COVID-19, del pais buscado en un EMBED.
        });
    } else if (command === "blacklist") {
      if (!staff.includes(message.author.id)) return;
      let usuario =
        message.mentions.users.first() || client.users.resolve(args[1]);

      if (!usuario) return message.reply("Menciona a alguien!");

      const existe_usuario = client.users.resolve(usuario.id);

      if (!existe_usuario) return message.reply("El usuario no fue encontrado");

      prohibido.establecer(usuario.tag, "Blacklisteado");

      message.channel.send(
        "El usuario " + usuario.tag + " Se ha blacklisteado correctamente"
      );
    } else if (command === "prefix") {
      if (!args[1]) {
        if (le == "español")
          return message.reply(
            "El prefix aquí es: **" +
              prefix +
              "**\nUsa **" +
              prefix +
              "help** para ver los comandos!"
          );
        else
          return message.reply(
            "The prefix here is **" +
              prefix +
              "**\nUse **" +
              prefix +
              "help** to view the category list!"
          );
      }
      if (["739811956638220298"].includes(message.guild.id)) {
        if (le == "español")
          return message.channel.send(
            "Los comandos de moderacion estan deshabilitados!"
          );
        else
          return message.reply(
            "Moderation commands are disabled on this server!"
          );
      }

      if (!message.member.permissions.has("MANAGE_GUILD")) {
        if (le == "español")
          return message.reply(
            "No tienes permisos para ejecutar este comando!"
          );
        else
          return message.reply(
            "You don't have permissions to use this command!"
          );
      }

      const nuevo = args.slice(1).join(" ");

      if (nuevo == prefix) {
        if (le == "español")
          return message.channel.send("Ese ya es mi prefix ._ .");
        else return message.reply("That's actually my prefix ._ .");
      }

      if (nuevo.length > 4) {
        if (le == "español")
          return message.channel.send(
            "Ups, el nuevo prefix no puede contener más de 4 caracteres ._ ."
          );
        else
          return message.reply(
            "Ups! The new prefix may not contain more than 4 characters ._ ."
          );
      }
      prefixes.establecer(message.guild.id, nuevo);
      if (message.guild.me.permissions.has("CHANGE_NICKNAME"))
        message.guild.me.setNickname("[" + nuevo + "] " + client.user.username);
      let embed;

      if (le == "español") {
        embed = {
          embed: {
            title: "Exito!",
            description: "El prefix de este servidor ahora es " + nuevo,
            color: exito_color
          }
        };
      } else {
        embed = {
          embed: {
            title: "Success!",
            description: "The prefix of this server is now " + nuevo,
            color: exito_color
          }
        };
      }
      message.channel.send(embed);
    } else if (command === "clear") {
      const monto = args.slice(1).join(" ");

      if (["739811956638220298"].includes(message.guild.id)) {
        if (le == "español")
          return message.channel.send(
            "Los comandos de moderacion estan deshabilitados!"
          );
        else
          return message.channel.send(
            "Moderation commands are disabled on this server!"
          );
      }

      if (!message.member.permissions.has("MANAGE_MESSAGES")) {
        if (le == "español")
          return message.reply(
            "No tienes permisos para ejecutar este comando!"
          );
        else
          return message.reply(
            "You don't have permissions to use this command!"
          );
      }

      if (!monto) {
        if (le == "español")
          return message.reply("Selecciona el número de mensajes a borrar.");
        else
          return message.reply(
            "Please select the number of messages to delete."
          );
      }

      if (monto > 100) {
        if (le == "español")
          return message.reply("No puedes borrar más de 100 mensajes.");
        else return message.reply("You can't delete more than 100 messages");
      }

      if (monto < 1) {
        if (le == "español")
          return message.reply("No puedes borrar menos de 1 mensaje");
        else return message.reply("You cant delete less than 1 message");
      }

      if (isNaN(monto)) {
        if (le == "español") return message.reply("Ese no es un número!");
        else return message.reply("Invalid number!");
      }

      {
        if (le == "español")
          message.channel.send(`Borrando ${monto} mensajes...`).then(m => {
            message.channel.bulkDelete(monto);
            m.edit("Borrados " + monto + " mensajes!");
          });
        else
          message.channel.send(`Deleting ${monto} messages...`).then(m => {
            message.channel.bulkDelete(monto);
            m.edit("Deleted " + monto + " messages!");
          });
      }
    } else if (command === "notas") {
      const MeowDB = require("meowdb"); //npm i meowdb
      const notes = new MeowDB({
        dir: __dirname,
        name: "notes"
      });
      if (args[1] === "añadir") {
        if (!args[2]) {
          if (le == "español")
            return message.channel.send("Escribe alguna nota!");
          else return message.reply("Put some text!");
        }
        if (notes.exists(message.author.id)) {
          const arr = notes.get(message.author.id);
          arr.push(
            args
              .slice(2)
              .join(" ")
              .replace(/(\r\n|\n|\r)/gm, " ")
          );
          notes.set(message.author.id, arr);
          {
            if (le == "español")
              message.channel.send(
                "He añadido la nota con éxito! Mírala con **" +
                  prefix +
                  "notas** !!!"
              );
            else
              message.chanel.send(
                "I've added the new note! check it with **" +
                  prefix +
                  "notas** !"
              );
          }
        } else {
          notes.create(message.author.id, [args.slice(2).join(" ")]);
          {
            if (le == "español")
              message.channel.send(
                "He añadido la nota con éxito! Mírala con **" +
                  prefix +
                  "notas** !!!"
              );
            else
              message.channel.send(
                "I've added the new note! check it with **" +
                  prefix +
                  "notas** !!!"
              );
          }
        }
      } else if (args[1] === "quitar") {
        if (notes.exists(message.author.id)) {
          if (!args[2]) {
            if (le == "español")
              return message.channel.send(
                "Escribe la ID de la nota o escribe **" +
                  prefix +
                  "quitar all**"
              );
            else
              return message.channel.send(
                "Write the ID of the note or use **" +
                  prefix +
                  "notas quitar all**"
              );
          }
          if (args[2] === "all") {
            notes.delete(message.author.id);
            if (le == "español")
              message.channel.send(
                "He quitado **todas** tus notas con éxito! Para escribir otra escribe **" +
                  prefix +
                  "notas añadir (texto)**"
              );
            else
              message.channel.send(
                "I deleted **all** of your notes successfully! To write a new note type **" +
                  prefix +
                  "notas añadir (text)**"
              );
          } else {
            const arr = notes.get(message.author.id);
            let o = parseInt(args[2]);
            if (!o) {
              if (le == "español") return message.channel.send("ID inválida!");
              else return message.channel.send("Invalid ID");
            }
            let i = o - 1;
            if (!arr[i]) {
              if (le == "español")
                return message.channel.send("Esa ID de nota no existe ._ .");
              else
                return message.channel.send("That note ID does not exist ._ .");
            }
            arr.splice(i, 1);
            notes.set(message.author.id, arr);
            {
              if (le == "español")
                message.channel.send(
                  "He eliminado esa nota con éxito! Para escribir otra escribe **" +
                    prefix +
                    "notas añadir (texto)**"
                );
              else
                message.channel.send(
                  "I've deleted that note! To create one type **" +
                    prefix +
                    "notas añadir (text)** !!"
                );
            }
          }
        } else {
          if (le == "español")
            return message.channel.send("No tienes ninguna nota!");
          else return message.channel.send("You don't have any notes!");
        }
      } else if (args[1] === "editar") {
        if (notes.exists(message.author.id)) {
          if (!args[2]) {
            if (le == "español")
              return message.channel.send(
                "Escribe la ID de la nota que quieras editar!"
              );
            else
              return message.channel.send("Type the note ID you want to edit");
          } else {
            const arr = notes.get(message.author.id);
            let o = parseInt(args[2]);
            if (!o) {
              if (le == "español") return message.channel.send("ID Inválida!");
              else return message.channel.send("Invalid ID!");
            }
            let i = o - 1;
            if (!arr[i]) {
              if (le == "español")
                return message.channel.send("Esa ID de nota no existe!");
              else return message.channel.send("That note ID does not exist!");
            }
            if (!args[3]) {
              if (le == "español")
                return message.channel.send("Escribe la nueva nota!");
              else return message.channel.send("Type the new note!");
            }
            arr[i] = args
              .slice(3)
              .join(" ")
              .replace(/(\r\n|\n|\r)/gm, " ");
            notes.set(message.author.id, arr);
            {
              if (le == "español") message.channel.send("La nota fue editada!");
              else message.channel.send("The note has been edited!");
            }
          }
        } else {
          if (le == "español")
            return message.channel.send(
              "No tienes ninguna nota! Para escribir una escribe **" +
                prefix +
                "notas añadir (texto)**"
            );
          else return message.channel.send("You don't have any notes!");
        }
      } else {
        if (notes.exists(message.author.id)) {
          const arr = notes.get(message.author.id);
          if (!arr[0]) {
            if (le == "español")
              return message.channel.send(
                "No tienes ninguna nota! Para escribir una escribe **" +
                  prefix +
                  "notas añadir (texto)**"
              );
            else return message.channel.send("You don't have any notes!");
          }
          let text = "";
          let i = 0;
          arr.forEach(r => {
            i++;
            text += i + ". " + r + "\n";
          });
          const embed = new MessageEmbed();

          if (le == "español") {
            embed
              .setTitle("Notas de: " + message.author.username)
              .setDescription(text)
              .setColor("BLUE")
              .setFooter(
                "Para añadir una nota escribe " +
                  prefix +
                  "notas añadir (texto)!"
              )
              .setTimestamp();
          } else {
            embed
              .setTitle("Notes of: " + message.author.username)
              .setDescription(text)
              .setColor("BLUE")
              .setFooter("To add a note use " + prefix + "notas añadir (text)!")
              .setTimestamp();
          }
          message.channel.send(embed);
        } else
          return message.channel.send(
            "No tienes ninguna nota! Para escribir una escribe **" +
              prefix +
              "notas añadir (texto)**"
          );
      }
    } else if (command === "notes") {
      const n = new MessageEmbed();
      if (le == "español") {
        n.setTitle("Notas! :pencil2:")
          .addField(prefix + "notas", "Mira tus notas")
          .addField(prefix + "notas añadir (texto)", "Añade una nota")
          .addField(
            prefix + "notas quitar (ID/all)",
            "Quita una nota con la ID"
          )
          .addField(
            prefix + "notas editar (ID) (nuevo texto)",
            "Edita una nota"
          )
          .setThumbnail(client.user.displayAvatarURL())
          .setColor("YELLOW");
      }
      if (le == "english") {
        n.setTitle("Notes! :pencil2:")
          .addField(prefix + "notas", "Show your notes")
          .addField(prefix + "notas añadir (text)", "Add a note")
          .addField(
            prefix + "notas quitar (ID/all)",
            "Deletes a note with de ID"
          )
          .addField(prefix + "notas editar (ID) (new text)", "Edits a note")
          .setThumbnail(client.user.displayAvatarURL())
          .setColor("YELLOW");
      }
      message.channel.send(n);
    } else if (command === "setwelcome") {
      if (["739811956638220298"].includes(message.guild.id)) {
        if (le == "español")
          return message.channel.send(
            "Los comandos de moderacion estan deshabilitados!"
          );
        else return message.channel.send("Moderation commands are disabled!");
      }
      if (!message.member.permissions.has("MANAGE_CHANNELS")) {
        if (le == "español")
          return message.reply(
            "No tienes los suficientes permisos para ejecutar este comando!"
          );
        else
          return message.reply(
            "You don't have permissions to use this command!"
          );
      }
      const mencion =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]) ||
        message.channel;

      bienvenidas.establecer(message.guild.id, mencion.id);

      if (le == "español")
        message.channel.send(
          "El canal establecido para las bienvenidas ahora es: <#" +
            mencion.id +
            "> !!!"
        );
      else
        message.channel.send(
          "The welcome channel has been set to <#" + mencion.id + "> !!!"
        );
    } else if (command === "meme") {
      if (le == "español") {
        let random_memes = [
          dimgs.randomMemeImagen(),
          "https://cdn.discordapp.com/attachments/770438377555623946/787547574344351754/5ec3f1d028b85.jpeg",
          "https://cdn.discordapp.com/attachments/770438377555623946/787531566540390400/126622543_130326142186275_204036005480305568_n.jpg",
          "https://cdn.discordapp.com/attachments/770438377555623946/787503942577160213/unknown.png",
          "https://cdn.discordapp.com/attachments/770438377555623946/787380982424403988/IMG-20201210-WA0029.jpg",
          "https://cdn.discordapp.com/attachments/770438377555623946/787380481745485834/IMG-20201209-WA0020.jpg",
          "https://cdn.discordapp.com/attachments/770438377555623946/787380436988067841/image0.jpg",
          "https://cdn.discordapp.com/attachments/770438377555623946/787380377659375646/riborroblack-___CIJPA5EDqUV___-.jpg",
          "https://cdn.discordapp.com/attachments/770438377555623946/787380202790453258/IMG-20201210-WA0021.jpg",
          "https://i.pinimg.com/originals/4c/b4/8c/4cb48c669dc369e7c10f70ac4b09916f.jpg",
          "https://cdn.discordapp.com/attachments/762446479482159144/787690801064050729/9k.png",
          "https://images7.memedroid.com/images/UPLOADED736/5d39e95323e3e.jpeg",
          "https://images3.memedroid.com/images/UPLOADED621/5fcf6c7b32669.jpeg",
          "https://images3.memedroid.com/images/UPLOADED545/5fc0622599667.jpeg",
          "https://images3.memedroid.com/images/UPLOADED469/5c92f47817720.jpeg",
          "https://images3.memedroid.com/images/UPLOADED480/5f889ea9cc67a.jpeg",
          "https://images3.memedroid.com/images/UPLOADED99/5fbee4f58ef01.jpeg",
          "https://images7.memedroid.com/images/UPLOADED638/5fac930fcbfa8.jpeg",
          "https://images7.memedroid.com/images/UPLOADED226/5fd4e7cc960b7.jpeg"
        ];

        let memes =
          random_memes[Math.floor(Math.random() * random_memes.length)];

        const meme = new MessageEmbed()
          .setTitle("MEME")
          .setImage(memes)
          .setColor("RANDOM");

        let msg = await message.channel.send(meme);

        await msg.react("🔁");

        await msg.react("⏹️");

        let filter = (reaction, user) =>
          ["🔁", "⏹️"].includes(reaction.emoji.name) &&
          user.id == message.author.id;

        let collector = msg.createReactionCollector(filter, {
          time: 60000,
          max: Infinity
        });

        collector.on("collect", async reaction => {
          switch (reaction.emoji.name) {
            case "🔁":
              msg.edit(
                new MessageEmbed()
                  .setTitle("MEME")
                  .setImage(
                    random_memes[
                      Math.floor(Math.random() * random_memes.length)
                    ]
                  )
                  .setColor("RANDOM")
              );
              break;

            case "⏹️":
              collector.stop();
              break;
          }
        });
        collector.on("end", () => {
          if (permisos.has("MANAGE_MESSAGES")) msg.reactions.removeAll();
        });
      } else {
        const { meme } = require("memejs");

        //en este caso yo filtrare el subreddit del que obtendremos los memes, sin embargo se puede no filtrar.

        meme(async function(err, data) {
          const embed = new MessageEmbed()
            .setTitle("MEME")
            .setColor("RANDOM")
            .setImage(data.url); //el body de data contiene diferentes cosas pero para obtener la imagen necesitamos "url"
          let msg = await message.channel.send(embed);
          await msg.react("🔁");
          await msg.react("⏹️");

          let filter = (reaction, user) =>
            ["🔁", "⏹️"].includes(reaction.emoji.name) &&
            user.id == message.author.id;

          let collector = msg.createReactionCollector(filter, {
            time: 60000,
            max: Infinity
          });
          collector.on("collect", async reaction => {
            switch (reaction.emoji.name) {
              case "🔁":
                meme(function(err, data) {
                  msg.edit(
                    new MessageEmbed()
                      .setTitle("MEME")
                      .setImage(data.url)
                      .setColor("RANDOM")
                  );
                });

                break;
              case "⏹️":
                collector.stop();
                break;
            }
            collector.on("end", collected => {
              if (permisos.has("MANAGE_MESSAGES")) msg.reactions.removeAll();
            });
          });
        });
      }
    } else if (command === "snipe") {
      const channel = message.mentions.channels.first() || message.channel;

      const msg = client.snipes.get(channel.id);

      if (!msg) {
        if (le == "español")
          message.channel
            .send("No se ha borrado recientemente ningun mensaje")
            .then(m => m.delete({ timeout: 5000 }));
        else
          message.channel
            .send("There are no deleted messages recently")
            .then(m => m.delete(5000));
      } else {
        const main = new MessageEmbed()
          .setColor("#FF0000")
          .setAuthor(msg.delete.tag, msg.delete.displayAvatarURL())
          .setDescription(msg.content);
        if (msg.image) main.setImage(msg.image);

        message.channel.send(main);
      }
    } else if (command === "ppt") {
      if (le == "español") {
        if (!args[1])
          return message.channel
            .send("Opciones: `piedra`, `papel` o `tijera`")
            .then(m => m.delete({ timeout: 10000 }));

        if (args[1].toLowerCase() == "piedra") {
          let random = [
            `Elejiste: **Piedra**, Yo elejí: **Piedra**\nHas **empatado**`,
            `Elejiste: **Piedra**, Yo elejí: **Papel**\nHas **perdido**`,
            `Elejiste: **Piedra**, Yo elejí: **Tijera**\nHas **ganado**`
          ];
          const piedra = new MessageEmbed()
            .setTitle("Piedra, Papel o Tijera!")
            .setDescription(random[Math.floor(Math.random() * random.length)])
            .setColor("RANDOM");
          message.channel.send(piedra);
        } else if (args[1].toLowerCase() == "papel") {
          let random = [
            `Elejiste: **Papel**, Yo elejí: **Piedra**\nHas **ganado**`,
            `Elejiste: **Papel**, Yo elejí: **Papel**\nHas **empatado**`,
            `Elejiste: **Papel**, Yo elejí: **Tijera**\nHas **perdido**`
          ];
          const papel = new MessageEmbed()
            .setTitle("Piedra, Papel o Tijera!")
            .setDescription(random[Math.floor(Math.random() * random.length)])
            .setColor("RANDOM");
          message.channel.send(papel);
        } else if (args[1].toLowerCase() == "tijera") {
          let random = [
            `Elejiste: **Tijera**, Yo elejí: **Papel**\nHas **ganado**`,
            `Elejiste: **Tijera**, Yo elejí: **Piedra**\nHas **perdido**`,
            `Elejiste: **Tijera**, Yo elejí: **Tijera**\nHas **empatado**`
          ];
          const tijera = new MessageEmbed()
            .setTitle("Piedra, Papel o Tijera!")
            .setDescription(random[Math.floor(Math.random() * random.length)])
            .setColor("RANDOM");
          message.channel.send(tijera);
        } else
          return message.channel.send(
            ":x: **|** Debes elejir `piedra`, `papel`, o `tijera`."
          );
      }
      /////////////////////////////////////////////////////////////////////INGLES////////////////////////////////////////////////////////////////////
      else {
        if (!args[1])
          return message.channel
            .send("Options: `rock`, `paper` o `scissors`")
            .then(m => m.delete({ timeout: 10000 }));

        if (args[1].toLowerCase() == "rock") {
          let random = [
            `You selected: **Rock**, I selected: **Rock**\nIts a **tie**`,
            `You selected: **Rock**, I selected: **Paper**\nYou **lose**`,
            `You selected: **Rock**, I selected: **Scissors**\nYou **win**`
          ];
          const piedra = new MessageEmbed()
            .setTitle("Rock, Paper, Scissors!")
            .setDescription(random[Math.floor(Math.random() * random.length)])
            .setColor("RANDOM");
          message.channel.send(piedra);
        } else if (args[1].toLowerCase() == "paper") {
          let random = [
            `You selected: **Paper**, I selected: **Rock**\nYou **win**`,
            `You selected: **Paper**, I selected: **Paper**\nIts a **tie**`,
            `You selected: **Paper**, I selected: **Scissors**\nYou **lose**`
          ];
          const papel = new MessageEmbed()
            .setTitle("Rock, Paper, Scissors!")
            .setDescription(random[Math.floor(Math.random() * random.length)])
            .setColor("RANDOM");
          message.channel.send(papel);
        } else if (args[1].toLowerCase() == "scissors") {
          let random = [
            `You selected: **Scissors**, I selected: **Rock**\nYou **lose**`,
            `You selected: **Scissors**, I selected: **Scissors**\nIts a **tie**`,
            `You selected: **Scissors**, I selected: **Paper**\nYou win`
          ];
          const tijera = new MessageEmbed()
            .setTitle("Rock, Paper, Scissors!")
            .setDescription(random[Math.floor(Math.random() * random.length)])
            .setColor("RANDOM");
          message.channel.send(tijera);
        } else
          return message.channel.send(
            ":x: **|** Please select `rock`, `paper`, or `scissors`."
          );
      }
    } else if (command === "setcooldown") {
      if (["739811956638220298"].includes(message.guild.id)) {
        if (le == "español")
          return message.channel.send(
            "Los comandos de moderacion estan deshabilitados!"
          );
        else return message.channel.send("Moderation commands are disabled");
      }
      if (!message.member.permissions.has("MANAGE_CHANNELS")) {
        if (le == "español")
          return message.reply(
            "No tienes los suficientes permisos para ejecutar este comando!"
          );
        else
          return message.channel.send(
            "You don't have the enough permissions to use this command!"
          );
      }

      if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
        if (le == "español")
          return message.reply(
            "Por favor, necesito el permiso de administrar canales! Añadamelo!"
          );
        else
          return message.reply(
            "Please give me the permissions to manage channels!"
          );
      }

      let tiempo = args[1];

      let conversion = ms(tiempo); // Esto dará como resultado milisegundos.
      let segundos = Math.floor(conversion / 1000);

      if (args[1] === "off") {
        // usaremos esto en caso de que queramos desactivar el cooldown
        message.channel.setRateLimitPerUser(0); // lo establecemos en 0 (osea, normal xd)
        if (le == "español")
          message.channel.send(
            `Modo pausado deshabilitado! :white_check_mark:`
          );
        else message.channel.send("Paused mode disabled! :white_check_mark:"); // mandamos el mensaje que se desactivó
      } else if (!tiempo) {
        if (le == "español")
          message.channel.send("Incluye el formato de hora.");
        else return message.channel.send("Include the time format");
      }

      if (segundos > 21600) {
        if (le == "español")
          return message.channel.send(
            "El temporizador debe ser menor o igual a 6 horas."
          );
        else
          return message.channel.send(
            "The time must be less or equal to 6 hours"
          );
      } else if (segundos < 1) {
        if (le == "español")
          return message.channel.send(
            "El temporizador debe ser mayor o igual a 1 segundo."
          );
        else
          return message.channel.send(
            "The time must be more or equal to 1 second"
          );
      } else if (isNaN(segundos) || segundos == undefined) {
        if (le == "español")
          return message.reply("Por favor ingrese un formato válido!");
        else return message.channel.send("Please input a valid format!");
      }
      await message.channel.setRateLimitPerUser(segundos); // estableceremos el cooldown marcado.

      if (le == "español")
        message.channel.send(`Modo pausado habilitado! :white_check_mark:`);
      else message.channel.send("Paused mode enabled! :white_check_mark:");
    }
    //////////////////////////////////////////////////////////////////COMANDO PLAYSTORE//////////////////////////////////////////////////////////////////////////////
    else if (command === "playstore") {
      var play = require("google-play-scraper"); //para primero crearemos una variable play que sera el npm que descargamos
      let busqueda = args.slice(1).join(" ");
      if (message.author.bot) {
        //para primero si el author del mensaje es un bot
        return; //returnamos nada
      } //y cerramos
      if (!busqueda) {
        //haora le decimos si no hay busqueda que ya lo definimos mas arriga
        if (le == "español")
          return message.channel.send("Que quieres que busque ?");
        else return message.channel.send("What do you want me to search ?"); //returnamos un mensaje
      } //y cerramos
      play
        .search({
          //haora con nuestra variable play iniciamos una busqueda
          term: busqueda, //buscamos nuestra busqueda
          num: 1 //y el primer resultado
        })
        .then(as => {
          //haora lo optenemos
          play.app({ appId: as[0].appId }).then(res => {
            const embed = new MessageEmbed();
            if (le == "español") {
              embed //creamos una constante embed donde crearemos un nuevo mensaje embed
                .setColor("RANDOM") //le agregamos un color al embed en este caso un color random
                .setThumbnail(res.icon) //haora le agregamos un thumbnail en la que sacaremos el icon de nuestra busqueda
                .addField("Nombre", res.title) //le agregamos un field al embed en la que entramos a la res y sacamos el titulo de la app
                .addField("Descripción", res.summary) //agregamos otro field al embed en la que entraremos a la res y sacaremos sumary que es como la descripcion de lo que hace la app
                .addField("Descargas", res.installs) //le agregamos otro field en la que sacaremos los installs (descargas) que tiene la app
                .addField("Calificaciones", res.ratings) //le agregamos otro field en la que sacaremos en cuanto ranting esta esa app
                .addField(
                  "Precio",
                  res.priceText != "Free" ? res.priceText : "Gratis"
                ) //le agregamos otro field en la que sacaremos el precio de la app si es gratis devolvera free
                .addField("ID", res.appId) //agregamos otro field en la que entraremos a los datos y sacaremos la id de la cancion
                .addField("Género", res.genre) //agregamos otro field en la que pondremos el genero de la app
                .addField("App URL", "[Aquí](" + res.url + ")") //agregamos otro field en la que sacaremos el link directo a la app
                .addField(
                  "Creador",
                  "Nombre: " +
                    res.developer +
                    "\n" +
                    "Gmail: " +
                    res.developerEmail +
                    "\n" +
                    "Sitio Web: " +
                    res.developerWebsite +
                    "\n" +
                    "Dirección: " +
                    res.developerAddress +
                    "ID: " +
                    res.developerId
                ) //haora agregamos otro field pero en este sacaremos todos los datos de desarrollador
                .addField(
                  "Cambios recientes",
                  res.recentChanges.replace("<br>", "\n")
                ) //agregamos otro field en la que pondremos la descripcion de la app
                .setTimestamp();
            } else {
              embed //creamos una constante embed donde crearemos un nuevo mensaje embed
                .setColor("RANDOM") //le agregamos un color al embed en este caso un color random
                .setThumbnail(res.icon) //haora le agregamos un thumbnail en la que sacaremos el icon de nuestra busqueda
                .addField("Name", res.title) //le agregamos un field al embed en la que entramos a la res y sacamos el titulo de la app
                .addField("Description", res.summary) //agregamos otro field al embed en la que entraremos a la res y sacaremos sumary que es como la descripcion de lo que hace la app
                .addField("Downloads", res.installs) //le agregamos otro field en la que sacaremos los installs (descargas) que tiene la app
                .addField("Ratings", res.ratings) //le agregamos otro field en la que sacaremos en cuanto ranting esta esa app
                .addField("Price", res.priceText) //le agregamos otro field en la que sacaremos el precio de la app si es gratis devolvera free
                .addField("ID", res.appId) //agregamos otro field en la que entraremos a los datos y sacaremos la id de la cancion
                .addField("Genre", res.genre) //agregamos otro field en la que pondremos el genero de la app
                .addField("App URL", "[Here](" + res.url + ")") //agregamos otro field en la que sacaremos el link directo a la app
                .addField(
                  "Owner",
                  "Name: " +
                    res.developer +
                    "\n" +
                    "Gmail: " +
                    res.developerEmail +
                    "\n" +
                    "Website: " +
                    res.developerWebsite +
                    "\n" +
                    "Address: " +
                    res.developerAddress +
                    "ID: " +
                    res.developerId
                ) //haora agregamos otro field pero en este sacaremos todos los datos de desarrollador
                .addField(
                  "Recent changes",
                  res.recentChanges
                    .replace("<br>", "\n")
                    .replace("<strong>", "**")
                    .replace("</strong>", "**")
                    .replace("<em>", "*")
                    .replace("</em>", "*")
                ) //agregamos otro field en la que pondremos la descripcion de la app
                .setTimestamp();
            }

            message.channel.send(embed);
          });
        });
    } else if (command === "rolelist") {
      const roles = new MessageEmbed();
      if (le == "español") {
        roles
          .setTitle("Lista de roles de: " + message.guild.name)
          .setDescription(
            message.guild.roles.cache.map(e => e.toString()).join(" | ")
          )
          .setColor(exito_color);
      } else {
        roles
          .setTitle("Role List of server: " + message.guild.name)
          .setDescription(
            message.guild.roles.cache.map(e => e.toString()).join(" | ")
          )
          .setColor(exito_color);
      }
      message.channel.send(roles);
    } else if (command === "emojilist") {
      if (message.guild.emojis.cache.size < 1) {
        if (le == "español")
          return message.channel.send("¡Este servidor no tiene emojis!");
        else return message.channel.send("This server does not have emojis!");
      }

      if (!permisos.has("ADD_REACTIONS")) {
        if (le == "español")
          return message.channel.send(
            "Necesito el permiso de añadir reacciones para manejarte con ellas"
          );
        else
          return message.channel.send(
            "I need permission to add reactions so you can work with them"
          );
      }

      if (le == "español") {
        let emojis = [],
          emojis_a = [];

        message.guild.emojis.cache
          .filter(x => !x.animated)
          .map(x => emojis.push(`<:${x.name}:${x.id}>`));

        message.guild.emojis.cache
          .filter(x => x.animated)
          .map(x => emojis_a.push(`<a:${x.name}:${x.id}>`));

        let m = await message.channel.send({
          embed: {
            title: `Lista de emojis de: ${message.guild.name}`,
            color: "RANDOM",
            fields: [
              {
                name: "Emojis normales:",
                value:
                  emojis.slice(0, 10).join(" **|** ").length < 1
                    ? "Ninguno"
                    : emojis.slice(0, 10).join(" **|** ")
              },
              {
                name: "Emojis animados:",
                value:
                  emojis_a.slice(0, 10).join(" **|** ").length < 1
                    ? "Ninguno"
                    : emojis_a.slice(0, 10).join(" **|** ")
              }
            ],
            author: {
              name: `${message.author.tag}`,
              icon_url: message.author.displayAvatarURL()
            }
          }
        });
        await m.react("⬅️");
        await m.react("⏹️");
        await m.react("➡️");
        let i = 0;
        let i2 = 10;
        let filtro = (reaction, user) =>
          ["⬅️", "⏹️", "➡️"].includes(reaction.emoji.name) &&
          user.id == message.author.id;
        let colector = m.createReactionCollector(filtro, {
          time: 60000,
          max: 10
        });
        colector.on("collect", reaction => {
          switch (reaction.emoji.name) {
            case "⬅️":
              if (i > 1) {
                i -= 10;
                i2 -= 10;
                if (permisos.has("MANAGE_MESSAGES"))
                  reaction.users.remove(message.author.id);
                m.edit({
                  embed: {
                    title: `Lista de emojis de: ${message.guild.name}`,
                    color: "RANDOM",
                    fields: [
                      {
                        name: "Emojis normales:",
                        value:
                          emojis.slice(i, i2).join(" **|** ").length < 1
                            ? "Ninguno"
                            : emojis.slice(i, i2).join(" **|** ")
                      },
                      {
                        name: "Emojis animados:",
                        value:
                          emojis_a.slice(i, i2).join(" **|** ").length < 1
                            ? "Ninguno"
                            : emojis_a.slice(i, i2).join(" **|** ")
                      }
                    ],
                    author: {
                      name: `${message.author.tag}`,
                      icon_url: message.author.displayAvatarURL({
                        dynamic: true
                      })
                    }
                  }
                });
              }
              break;
            case "⏹️":
              colector.stop();
              m.delete();
              if (permisos.has("MANAGE_MESSAGES")) m.reactions.removeAll();

              break;
            case "➡️":
              if (permisos.has("MANAGE_MESSAGES"))
                reaction.users.remove(message.author.id);
              if (
                emojis.slice(i, i2 + 1)[emojis.slice(i, i2 + 1).length - 1] !==
                emojis[emojis.length - 1]
              ) {
                i += 10;
                i2 += 10;
                m.edit({
                  embed: {
                    title: `Lista de emojis de: ${message.guild.name}`,
                    color: "RANDOM",
                    fields: [
                      {
                        name: "Emojis normales:",
                        value:
                          emojis.slice(i, i2).join(" **|** ").length < 1
                            ? "Ninguno"
                            : emojis.slice(i, i2).join(" **|** ")
                      },
                      {
                        name: "Emojis animados:",
                        value:
                          emojis_a.slice(i, i2).join(" **|** ").length < 1
                            ? "Ninguno"
                            : emojis_a.slice(i, i2).join(" **|** ")
                      }
                    ],
                    author: {
                      name: `${message.author.tag}`,
                      icon_url: message.author.displayAvatarURL({
                        dynamic: true
                      })
                    }
                  }
                });
              }
              break;
          }
        });
      } else {
        let emojis = [],
          emojis_a = [];

        message.guild.emojis.cache
          .filter(x => !x.animated)
          .map(x => emojis.push(`<:${x.name}:${x.id}>`));

        message.guild.emojis.cache
          .filter(x => x.animated)
          .map(x => emojis_a.push(`<a:${x.name}:${x.id}>`));

        let m = await message.channel.send({
          embed: {
            title: `Emojis of: ${message.guild.name}`,
            color: "RANDOM",
            fields: [
              {
                name: "Normal emojis:",
                value:
                  emojis.slice(0, 10).join(" **|** ").length < 1
                    ? "None"
                    : emojis.slice(0, 10).join(" **|** ")
              },
              {
                name: "Animated emojis:",
                value:
                  emojis_a.slice(0, 10).join(" **|** ").length < 1
                    ? "None"
                    : emojis_a.slice(0, 10).join(" **|** ")
              }
            ],
            author: {
              name: `${message.author.tag}`,
              icon_url: message.author.displayAvatarURL({ dynamic: true })
            }
          }
        });
        await m.react("⬅️");
        await m.react("⏹️");
        await m.react("➡️");
        let i = 0;
        let i2 = 10;
        let filtro = (reaction, user) =>
          ["⬅️", "⏹️", "➡️"].includes(reaction.emoji.name) &&
          user.id == message.author.id;
        let colector = m.createReactionCollector(filtro, {
          time: 60000,
          max: 10
        });
        colector.on("collect", async reaction => {
          switch (reaction.emoji.name) {
            case "⬅️":
              if (i > 1) {
                i -= 10;
                i2 -= 10;
                reaction.users.remove(message.author.id);
                await m.edit({
                  embed: {
                    title: `Emojis of: ${message.guild.name}`,
                    color: "RANDOM",
                    fields: [
                      {
                        name: "Normal emojis:",
                        value:
                          emojis.slice(i, i2).join(" **|** ").length < 1
                            ? "None"
                            : emojis.slice(i, i2).join(" **|** ")
                      },
                      {
                        name: "Animated emojis:",
                        value:
                          emojis_a.slice(i, i2).join(" **|** ").length < 1
                            ? "None"
                            : emojis_a.slice(i, i2).join(" **|** ")
                      }
                    ],
                    author: {
                      name: `${message.author.tag}`,
                      icon_url: message.author.displayAvatarURL({
                        dynamic: true
                      })
                    }
                  }
                });
              }
              break;
            case "⏹️":
              colector.stop();
              m.delete();
              if (permisos.has("MANAGE_MESSAGES")) m.reactions.removeAll();

              break;
            case "➡️":
              if (permisos.has("MANAGE_MESSAGES"))
                reaction.users.remove(message.author.id);
              if (
                emojis.slice(i, i2 + 1)[emojis.slice(i, i2 + 1).length - 1] !==
                emojis[emojis.length - 1]
              ) {
                i += 10;
                i2 += 10;
                m.edit({
                  embed: {
                    title: `Emojis of: ${message.guild.name}`,
                    color: "RANDOM",
                    fields: [
                      {
                        name: "Normal emojis:",
                        value:
                          emojis.slice(i, i2).join(" **|** ").length < 1
                            ? "None"
                            : emojis.slice(i, i2).join(" **|** ")
                      },
                      {
                        name: "Emojis animados:",
                        value:
                          emojis_a.slice(i, i2).join(" **|** ").length < 1
                            ? "None"
                            : emojis_a.slice(i, i2).join(" **|** ")
                      }
                    ],
                    author: {
                      name: `${message.author.tag}`,
                      icon_url: message.author.displayAvatarURL({
                        dynamic: true
                      })
                    }
                  }
                });
              }
              break;
          }
        });
      }
    }
    //////////////////////////////////////////////////////////////COMANDO INVITEINFO////////////////////////////////////////////////////////////////////////////////////
    else if (command === "inviteinfo") {
      if (!args[1]) {
        if (le == "español")
          return message.channel.send(
            "Uso: `inviteinfo [link], puede ser discord.gg, discord.com/invite, o solo el code`"
          );
        else
          return message.channel.send(
            "Usage: `inviteinfo [link]`, it can be discord.gg, discord.com/invite, or only the code"
          );
      }
      if (le == "español") {
        try {
          const invite = await client.fetchInvite(args[1]);
          const embed = new MessageEmbed()
            .setTitle("Info de la invitación")
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setColor("RANDOM");
          if (invite.guild) {
            let verif = {
              NONE: "Ninguna",
              LOW: "Baja",
              MEDIUM: "Media",
              HIGH: "Alta",
              VERY_HIGH: "Muy alta"
            };
            embed
              .setThumbnail(invite.guild.iconURL({ dynamic: true }))
              .addField("Tipo", "Invitación a servidor", true)
              .addField("Nombre", invite.guild.name, true)
              .addField(
                "Verificación",
                verif[invite.guild.verificationLevel],
                true
              )
              .addField("Miembros conectados", invite.presenceCount, true)
              .addField("Code de la invitación", invite.code)
              .addField(
                "Servidor",
                "[Unirse al servidor](https://discord.gg/" + invite.code + ")"
              );
          } //Si proviene de un grupo MD
          else if (invite.channel.type === "group") {
            embed
              .setThumbnail(invite.channel.iconURL({ dynamic: true }))
              .addField("Tipo", "Invitacion a Grupo de MD", true)
              .addField(
                "Nombre",
                invite.channel.name ? invite.channel.name : "Ninguno",
                true
              )
              .addField("Code de la invitación", invite.code)
              .addField(
                "Grupo",
                "[Unirse al grupo](https://discord.gg/" + invite.code + ")"
              );
          }
          embed.addField("Miembros", invite.memberCount, true);

          //Hay que ser ordenado en los fields
          if (invite.guild) {
            embed.addField("Te dirije a", invite.channel.name, true);
          }
          embed.addField(
            "Invitador",
            invite.inviter
              ? invite.inviter.tag + "\n" + invite.inviter.toString()
              : "Ninguno",
            true
          );

          //A enviarlo
          message.channel.send(embed);
        } catch (err) {
          if (err.message === "Unknown Invite")
            return message.channel.send("Invitación no Válida");
          else
            return message.channel.send(
              "Ups! Hubo un error, por favor repórtalo: `" + err + "`"
            );
        }
      } else {
        try {
          //Recoger la información desde la API
          const invite = await client.fetchInvite(args[1]);

          //Los embeds son bonitos, vamos a usarlos
          const embed = new MessageEmbed()
            .setTitle("Invite information")
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setColor("RANDOM");

          //Si en caso esto viene de un servidor...
          if (invite.guild) {
            let verif = {
              NONE: "None",
              LOW: "Low",
              MEDIUM: "Medium",
              HIGH: "High",
              VERY_HIGH: "Very high"
            };

            //Fijense que esos son los detalles que fetchInvite me dio.
            embed
              .setThumbnail(invite.guild.iconURL({ dynamic: true }))
              .addField("Type", "Server invite", true)
              .addField("Name", invite.guild.name, true)
              .addField(
                "Verification",
                verif[invite.guild.verificationLevel],
                true
              )
              .addField("Connected members", invite.presenceCount, true)

              .addField("Invite code", invite.code)
              .addField(
                "Server",
                "[Go to server](https://discord.gg/" + invite.code + ")"
              );
          } //Si proviene de un grupo MD
          else if (invite.channel.type === "group") {
            embed
              .setThumbnail(invite.channel.iconURL({ dynamic: true }))
              .addField("Type", "MD group invitation", true)
              .addField(
                "Name",
                invite.channel.name ? invite.channel.name : "None",
                true
              )
              .addField(
                "Group",
                "[Go to group](https://discord.gg/" + invite.code + ")"
              );
          }
          embed
            .addField("Members", invite.memberCount, true)

            .addField("Invite code", invite.code);

          //Hay que ser ordenado en los fields
          if (invite.guild) {
            embed.addField("Redirects you to", invite.channel.name, true);
          }
          embed.addField(
            "Inviter",
            invite.inviter
              ? invite.inviter.tag + "\n" + invite.inviter.toString()
              : "None",
            true
          );

          //A enviarlo
          message.channel.send(embed);
        } catch (err) {
          //Si fuera porque pusimos algo que no es invitación
          if (err.message === "Unknown Invite") {
            if (le == "español")
              return message.channel.send("Invitación no Válida");
            else return message.channel.send("Unknown invite");
          }
        }
      }
    }
    //////////////////////////////////////////////////////////COMANDO DESACTIVATEWELCOME/////////////////////////////////////////////////
    else if (command === "desactivate-welcome") {
      if (["739811956638220298"].includes(message.guild.id)) {
        if (le == "español")
          return message.channel.send(
            "Los comandos de moderacion estan deshabilitados!"
          );
        else return message.channel.send("Moderation commands are disabled!");
      }
      if (!message.member.permissions.has("MANAGE_CHANNELS")) {
        if (le == "español")
          return message.channel.send(
            "No tienes permisos para ejecutar este comando!"
          );
        else
          return message.channel.send(
            "You don't have permissions to use this command!"
          );
      }

      if (!bienvenidas.tiene(message.guild.id)) {
        if (le == "español")
          return message.channel.send("Este servidor no tiene bienvenidas!");
        else
          return message.channel.send(
            "This server does not have a welcome channel!"
          );
      }
      bienvenidas.eliminar(message.guild.id);

      if (le == "español")
        message.channel.send("Las bienvenidas se han eliminado con éxito!");
      else message.channel.send("The welcome channel has been deleted!");
    }

    ////////////////////////////////////////////////////////COMANDO EMOJI//////////////////////////////////////////////////////////////////////////
    else if (command === "jumbo") {
      if (!args[1]) {
        if (le == "español")
          return message.channel.send(
            "Debes poner un emoji! Debe ser del server"
          );
        else
          return message.reply("Please type an emoji! Must be of this server");
      }

      let emoji = message.guild.emojis.cache.find(
        x => x.name === args[1].split(":")[1]
      );
      if (!emoji) {
        if (le == "español")
          return message.channel.send(
            "Debes poner un emoji! Debe ser del server"
          );
        else
          return message.reply("Please type an emoji! Must be of this server");
      } //para que diga solo personalizados
      const embed = new MessageEmbed()
        .setTitle(emoji.name)
        .setDescription("[Emoji URL](" + emoji.url + ")")
        .setColor("RANDOM")
        .setImage(emoji.url);
      message.channel.send(embed);
    } else if (command === "emoji-info") {
      const emoji = client.emojis.cache.find(emoji => emoji.name === args[1]);

      let trues = {
        true: "Si",
        false: "No"
      };

      if (!args[1]) {
        if (le == "español") return message.reply("Debes poner un emoji!");
        else return message.channel.send("You have to put an emoji!");
      }

      if (!emoji) {
        if (le == "español")
          return message.reply(
            "Ese emoji no existe! O no estoy en el server! solo pon su nombre, puede ser de cualquier servidor en el que esté"
          );
        else
          return message.reply(
            "That emoji does not exist! Or i'm not in the server! only put the name, it can be from any server that i am"
          );
      }

      const eo = new MessageEmbed()
        .setTitle(emoji.name)
        .setThumbnail(emoji.url);

      if (le == "español") {
        eo.addField("Animado", trues[emoji.animated])
          .addField("Editado", trues[emoji.managed])
          .addField("Corta ID", emoji.id);
      } else {
        trues = {
          true: "Yes",
          false: "No"
        };
        eo.addField("Animated", trues[emoji.animated])
          .addField("Edited", trues[emoji.managed])
          .addField("Short ID", emoji.id);
      }
      if (emoji.animated) {
        if (le == "español") {
          eo.addField("Larga ID", "`<" + emoji.identifier + ">`");
          eo.addField("Link emoji", "[Click aquí](" + emoji.url + ")");
          eo.addField("Server", emoji.guild.name);
        } else {
          eo.addField("Long ID", "`<" + emoji.identifier + ">`")
            .addField("Emoji Link", "[Click](" + emoji.url + ")")
            .addField("Server", emoji.guild.name);
        }
      } else {
        if (le == "español") {
          eo.addField("Larga ID", "`<:" + emoji.identifier + ">`")
            .addField("Link emoji", "[Click aquí](" + emoji.url + ")")
            .addField("Server", emoji.guild.name);
        } else {
          eo.addField("Long ID", "`<:" + emoji.identifier + ">`")
            .addField("Emoji link", "[Click](" + emoji.url + ")")
            .addField("Server", emoji.guild.name);
        }
      }
      eo.setFooter(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true, format: "png" })
      );
      eo.setColor("#00FF00");
      message.channel.send(eo);
    }
    ////////////////////////////////////////////////////////COMANDO HACKBAN///////////////////////////////////////////////////////////
    else if (command === "hackban") {
      if (["739811956638220298"].includes(message.guild.id)) {
        if (le == "español")
          return message.channel.send(
            "Los comandos de moderacion estan deshabilitados!"
          );
        else return message.channel.send("Moderation commands are disabled!");
      }
      if (!message.member.permissions.has("BAN_MEMBERS")) {
        if (le == "español")
          return message.reply("Necesitas el permiso de banear miembros");
        else return message.channel.send("Moderation commands are disabled!");
      }

      if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
        if (le == "español")
          return message.reply("Necesito el permiso de banear miembros");
        else
          return message.channel.send("Please give me the permission to ban!");
      }

      let id = args[1];

      if (!id) {
        if (le == "español") return message.reply("Debes poner una ID!");
        else return message.channel.send("You have to put an ID!");
      }

      if (isNaN(id)) {
        if (le == "español") return message.reply("Debes poner una ID válida!");
        else return message.channel.send("You have to put a valid ID!");
      }

      let razon = args.slice(2).join(" ");

      if (!razon) {
        if (le == "español") razon = "Sin razón";
        else razon = "No reason";
      }

      let member = await client.users.fetch(id);
      if (!member) {
        if (le == "español") return message.reply("ID no encontrada");
        else return message.reply("Unknown ID");
      }
      message.guild.members.ban(member.id);

      const ban = new MessageEmbed();
      if (le == "español") {
        ban
          .setTitle("ID baneada!")
          .addField("Usuario", "<@!" + id + ">")
          .addField("Moderador", "<@!" + message.author.id + ">")
          .setColor("#FF0000r")
          .addField("Razón", razon);
      } else {
        ban
          .setTitle("ID banned!")
          .addField("User", "<@!" + id + ">")
          .addField("Moderator", "<@!" + message.author.id + ">")
          .setColor("#FF0000")
          .addField("Reason", razon);
      }
      message.channel.send(ban);
    }
    ///////////////////////////////////////////////////////////////COMANDO MASTEREMBED////////////////////////////////////////////////////////////////////
    else if (command === "masterembed") {
      if (
        !args
          .slice(1)
          .join(" ")
          .split("|")[2]
      ) {
        if (le == "español")
          return message.reply(
            "Debes escribir un titulo, descripcion y color! El texto se separa con `|`"
          );
        else
          return message.reply(
            "You have to put a title, description, and color! Split the text with `|`"
          );
      }
      const master = new MessageEmbed()
        .setTitle(
          args
            .slice(1)
            .join(" ")
            .split("|")[0]
        )
        .setDescription(
          args
            .slice(1)
            .join(" ")
            .split("|")[1]
        )
        .setColor(
          args
            .slice(1)
            .join(" ")
            .split("|")[2]
        );
      message.channel.send(master);
    } else if (command === "no-categoria") {
      const no = new MessageEmbed();
      if (le == "español") {
        no.setTitle("Comandos no categorizados")
          .addField(prefix + "say (texto)", "El bot dice lo que dices")
          .addField(
            prefix + "embedsay (texto)",
            "Un embed medio no profesional con tu texto"
          )
          .addField(
            prefix + "masterembed (titulo)|(descripcion)|(color)",
            "Un embed más profiesional"
          )
          .addField(
            prefix + "json-embed (JSON code)",
            "El embed más profesional, crea un embed a partir de JSON"
          )
          .setColor("WHITE");
      }
      if (le == "english") {
        no.setTitle("Non-categorized commands")
          .addField(prefix + "say (text)", "I say what you say")
          .addField(prefix + "embedsay (text)", "A non-professional embed")
          .addField(
            prefix + "masterembed (tite)|(description)|(color)",
            "A more professional embed"
          )
          .addField(
            prefix + "json-embed (JSON code)",
            "The most professional code"
          )
          .setColor("WHITE");
      }
      message.channel.send(no);
    } else if (command === "backup") {
      const backup = require("discord-backup");
      backup.setStorageFolder(__dirname + "/backups/");

      if (args[1] === "create") {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
          if (le == "español")
            return message.channel.send(
              "No puedes usar este comando necesitas permisos de administrador"
            );
          else
            return message.channel.send("You need administrator permissions!");
        }
        backup
          .create(message.guild, {
            jsonBeautify: true
          })
          .then(backupData => {
            // And send informations to the backup owner
            if (le == "español")
              message.author.send(
                new MessageEmbed()
                  .setAuthor(`🔒 Backup creado 🔒`)
                  .setColor(message.guild.me.displayHexColor)
                  .setDescription(
                    `Para cargarlo, usa ${prefix}backup load ${backupData.id}`
                  )
                  .setThumbnail(message.author.displayAvatarURL())
              );
            else
              message.author.send(
                new MessageEmbed()
                  .setAuthor(`🔒 Backup creado 🔒`)
                  .setColor(message.guild.me.displayHexColor)
                  .setDescription(
                    `Para cargarlo, usa ${prefix}backup load ${backupData.id}`
                  )
                  .setThumbnail(message.author.displayAvatarURL())
              );

            if (le == "español")
              message.channel
                .send(
                  new MessageEmbed()
                    .setAuthor(`🔒 Backup creado 🔒`)
                    .setColor(message.guild.me.displayHexColor)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setDescription("**La ID de la backup fue enviado al MD**")
                )
                .catch(err => {
                  const error = new MessageEmbed()
                    .setTitle("Ups")
                    .setDescription("No pude enviarte el code a tu MD")
                    .addField(
                      "Uso del backup",
                      "Para cargar el backup usa " +
                        prefix +
                        "backup load " +
                        backupData.id
                    )
                    .setColor("#ff0000");
                  message.channel.send(error);
                });
            else
              message.channel
                .send(
                  new MessageEmbed()
                    .setAuthor(`🔒 Backup created 🔒`)
                    .setColor(message.guild.me.displayHexColor)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setDescription("**The backup ID has been sent to the DM**")
                )
                .catch(err => {
                  const error = new MessageEmbed()
                    .setTitle("Ups")
                    .setDescription("I couldn't send you a DM")
                    .addField(
                      "Backup Usage",
                      "To load the backup use " +
                        prefix +
                        "backup load " +
                        backupData.id
                    )
                    .setColor("#ff0000");
                  message.channel.send(error);
                });
          });
      } else if (args[1] === "info") {
        let backupID = args[2];
        if (!backupID) {
          {
            if (le == "español")
              return message.channel.send(
                ":x: | Necesitas especificar un ID de backup!"
              );
            else
              return message.channel.send(":x: | You have to put a backup ID!");
          }
        }
        // Fetch the backup
        backup
          .fetch(backupID)
          .then(backupInfos => {
            let embed = new MessageEmbed();
            if (le == "español") {
              moment.updateLocale("es", {
                months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
                  "_"
                ),
                monthsShort: "Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.".split(
                  "_"
                ),
                weekdays: "Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado".split(
                  "_"
                ),
                weekdaysShort: "Dom._Lun._Mar._Mier._Jue._Vier._Sab.".split(
                  "_"
                ),
                weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sa".split("_")
              }); // ponemos los dias en español
              moment.locale("es");
              embed
                .setAuthor("Info de la backup")
                // Display the backup ID
                .addField("Backup ID", backupInfos.id, false)
                // Displays the server from which this backup comes
                .addField("Server ID", backupInfos.data.guildID, false)
                // Display the size (in mb) of the backup
                .addField("Tamaño", `${backupInfos.size} MB`, false)
                // Display when the backup was created
                .addField(
                  "Creado el",
                  moment.utc(backupInfos.data.createdTimestamp),
                  false
                )
                .setColor("#FF0000");
            } else {
              embed
                .setAuthor("Backup Info")
                // Display the backup ID
                .addField("Backup ID", backupInfos.id, false)
                // Displays the server from which this backup comes
                .addField("Server ID", backupInfos.data.guildID, false)
                // Display the size (in mb) of the backup
                .addField("Size", `${backupInfos.size} MB`, false)
                // Display when the backup was created
                .addField(
                  "Created at",
                  moment.utc(backupInfos.data.createdTimestamp),
                  false
                )
                .setColor("#FF0000");
            }
            message.channel.send(embed);
          })
          .catch(err => {
            // if the backup wasn't found
            if (le == "español")
              return message.channel.send(
                ":x: | No fue encontrada una backup con la ID `" +
                  backupID +
                  "`!"
              );
            else
              return message.channel.send(
                ":x: | The backup with the ID `" + backupID + "` was not found!"
              );
          });
      } else if (args[1] === "load") {
        let backupID = args[2];
        if (!backupID) {
          if (le == "español")
            return message.channel.send(
              ":x: | Necesitas especificar un ID de backup!"
            );
          else return message.channel.send(":x: | Please put a backup ID!");
        }
        backup.fetch(backupID).then(async () => {
          if (le == "español") {
            message.channel
              .send(
                ":warning: | Cuando cargue el backup, todos los canales y roles cambiaran! Estas seguro? Esta accion no se puede deshacer"
              )
              .then(m => {
                m.react("✅");
                const filtro = (reaction, user) => {
                  return (
                    ["✅"].includes(reaction.emoji.name) &&
                    user.id == message.author.id
                  );
                };
                m.awaitReactions(filtro, {
                  max: 1,
                  time: 20000,
                  errors: ["time"]
                })
                  .catch(() => {
                    m.edit(":x: | El tiempo se ha acabado, comando cancelado");
                  })
                  .then(coleccionado => {
                    const reaccion = coleccionado.first();

                    backup
                      .load(backupID, message.guild)
                      .then(() => {
                        backup.remove(backupID);
                      })
                      .catch(err => {
                        return message.author.send(
                          ":x: | Un error ha ocurrido, por favor checkea que tenga permisos de administrador!"
                        );
                      });
                  });
              });
          } else {
            message.channel
              .send(
                ":warning: | When the backup loads, all the channels and roles will be deleted! React with :white_check_mark: to confirm!"
              )
              .then(m => {
                m.react("✅");
                const filtro = (reaction, user) => {
                  return (
                    ["✅"].includes(reaction.emoji.name) &&
                    user.id == message.author.id
                  );
                };
                m.awaitReactions(filtro, {
                  max: 1,
                  time: 20000,
                  errors: ["time"]
                })
                  .catch(() => {
                    m.edit(":x: | Time is up, cancelled command.");
                  })
                  .then(coleccionado => {
                    const reaccion = coleccionado.first();

                    backup
                      .load(backupID, message.guild)
                      .then(() => {
                        backup.remove(backupID);
                      })
                      .catch(err => {
                        return message.author.send(
                          ":x: | An error has ocurred, please check that i have administrator permissions!"
                        );
                      });
                  });
              });
          }
        });
      }
    } else if (command === "charcount") {
      const letras = args.slice(1).join(" ");
      if (!letras) {
        if (le == "español") return message.reply("Debes escribir una frase");
        else return message.reply("Put some text!");
      }
      const e = new MessageEmbed();
      if (le == "español") {
        e.setTitle("Contador de caracteres")
          .setDescription(
            "Tu mensaje `" +
              letras +
              "`\n\nContiene `" +
              letras.length +
              "` Caracteres!"
          )
          .setColor("RANDOM");
      } else {
        e.setTitle("Character count!")
          .setDescription(
            "Your message `" +
              letras +
              "`\n\nContains `" +
              letras.length +
              "` Characters!"
          )
          .setColor("RANDOM");
      }
      if (letras.length > 1950) {
        if (le == "español") {
          e.setDescription(
            "Tu mensaje `(demasiado para mostrar)`\n\nContiene `" +
              letras.length +
              "` Caracteres!"
          );
        } else {
          e.setDescription(
            "Your message `(too much to show)`\n\nHas " +
              letras.length +
              "` Characters!"
          );
        }
      }

      message.channel.send(e);
    } else if (command === "json-embed") {
      try {
        const json = JSON.parse(args.slice(1).join(" "));
        return message.channel.send({
          embed: json
        });
      } catch (error) {
        if (le == "español") return message.channel.send(`JSON invalida`);
        else return message.channel.send("Invalid JSON");
      }
    } else if (command === "poll") {
      const split = args
        .slice(1)
        .join(" ")
        .split("/");

      let canal = message.mentions.channels.first();

      const poll = new MessageEmbed();
      if (le == "español") {
        poll
          .setTitle("📊 Encuesta!")
          .setDescription("**" + split[1] + "**")
          .addField(":one: Opción 1", "**" + split[2] + "**")
          .addField(":two: Opción 2", "**" + split[3] + "**")
          .setColor("BLUE")
          .setFooter(
            "Encuesta por " + message.member.displayName,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setTimestamp();
      } else {
        poll
          .setTitle("📊 Poll!")
          .setDescription("**" + split[1] + "**")
          .addField(":one: Option 1", "**" + split[2] + "**")
          .addField(":two: Option 2", "**" + split[3] + "**")
          .setColor("BLUE")
          .setFooter(
            "Poll by " + message.member.displayName,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setTimestamp();
      }
      if (!canal) canal = message.channel;

      if (!message.member.permissions.has("MANAGE_GUILD")) {
        if (le == "español")
          return message.reply("Necesitas permisos de gestionar servidor");
        else return message.reply("You need manage server permissions!");
      }
      if (!canal.permissionsFor(message.guild.me).has("ADD_REACTIONS")) {
        if (le == "español")
          return message.reply(
            "No puedo añadir reacciones! No podemos saber la opinión de los usuarios!"
          );
        else
          return message.reply(
            "I don't have permissions to add reactions! We can't know the users' opinion!"
          );
      }
      if (!canal.permissionsFor(message.guild.me).has("SEND_MESSAGES")) {
        if (canal.id == message.channel.id) {
          if (le == "español")
            return message.author.send(
              "Ups! No tengo permisos de enviar mensajes!"
            );
          else
            return message.author.send(
              "Oops! Looks like i don't have permissions to send messages!"
            );
        } else {
          if (le == "español")
            return message.channel.send(
              "Ups! Parece que no tengo permisos de enviar mensajes en ese canal!"
            );
          else
            return message.channel.send(
              "Oops! Looks like i don't have permissions to send messages! in that channel!"
            );
        }
      }
      if (!split[3])
        if (le == "español")
          return message.reply(
            "Uso: `" +
              prefix +
              "poll (#canal/pregunta/opcion1/opcion2/opcion3[opcional]/opcion4[opcional]/opcion5[opcional])`\nSi no quieres mencionar un canal, pon `" +
              prefix +
              "poll actual/.../.../...`"
          );
        else
          return message.reply(
            "Usage: `" +
              prefix +
              "poll (#channel/question/option1/option2/option3[optional]/option4[optional]/option5[optional])`\nIf you don't want to mention a channel, use`" +
              prefix +
              "poll actual/...`"
          );
      if (split[4]) {
        if (le == "español")
          poll.addField(":three: Tercera opción", "**" + split[4] + "**");
        else poll.addField(":three: Third option", split[4]);
      }
      if (split[5]) {
        if (le == "español")
          poll.addField(":four: Cuarta option", "**" + split[5] + "**");
        else poll.addField(":four: Fourth option", split[5]);
      }
      if (split[6]) {
        if (le == "español")
          poll.addField(":five: Quinta opción", "**" + split[6] + "**");
        else poll.addField(":five: Fifth option", split[6]);
      }
      if (split[7]) {
        if (le == "español") return message.reply("Demasiadas opciones");
        else return message.reply("Too many options");
      }

      if (!split[4])
        canal.send(poll).then(async function(message) {
          message.react("1️⃣");
          message.react("2️⃣");
        });
      else if (!split[5])
        canal.send(poll).then(async function(message) {
          message.react("1️⃣");
          message.react("2️⃣");
          message.react("3️⃣");
        });
      else if (!split[6])
        canal.send(poll).then(async function(message) {
          message.react("1️⃣");
          message.react("2️⃣");
          message.react("3️⃣");
          message.react("4️⃣");
        });
      else if (!split[7])
        canal.send(poll).then(async function(message) {
          message.react("1️⃣");
          message.react("2️⃣");
          message.react("3️⃣");
          message.react("4️⃣");
          message.react("5️⃣");
        });
      if (canal == message.mentions.channels.first()) {
        if (le == "español") {
          message.channel.send("Encuesta enviada");
        } else {
          message.channel.send("Poll sent");
        }
      }
    } else if (command === "trump") {
      message.channel.startTyping();
      const Jimp = require("jimp");
      if (!args[1]) {
        if (le == "español") return message.channel.send("Pon algo");
        else return message.channel.send("Type something");
      }
      let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
      let meme = await Jimp.read(
        "https://media.discordapp.net/attachments/359425464885837827/593819763797393438/TrumpApi.png"
      );
      const realtext = getWellText(args.slice(1).join(" "), 14, 88);
      meme.rotate(7);
      meme.print(font, 670, 320, realtext, 260);
      meme.rotate(-7, false);
      meme.autocrop();
      let render = await meme.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new MessageAttachment(render, "trump.png");
      await message.channel.send(attachment);
      function getWellText(text, maxWordLength, maxTextLength = Infinity) {
        let realtext = "",
          post_text = "";
        for (let i = 0; i < text.length; i++) {
          if (realtext.length > maxTextLength) break;
          post_text += text[i];
          if (text[i] === " ") {
            post_text = " ";
            realtext += text[i];
            continue;
          }
          if (post_text.length > maxWordLength) {
            realtext += " " + text[i];
            post_text = " ";
          } else {
            realtext += text[i];
          }
        }
        return realtext;
      }
      message.channel.stopTyping();
    } else if (command === "reactions") {
      if (!args[1]) {
        if (le == "español")
          return message.channel.send("Las reacciones estan `" + re + "`");
        else
          return message.channel.send(
            "Reactions are `" +
              re
                .replace("habilitadas", "enabled")
                .replace("deshabilitadas", "disabled")
          );
      }

      if (!message.member.permissions.has("MANAGE_GUILD")) {
        if (le == "español")
          return message.channel.send(
            "No tienes permisos para usar este comando!"
          );
        else
          return message.channel.send(
            "You don't have permissions to use this command!"
          );
      }

      if (args[1] === "off") {
        if (re == "deshabilitadas") {
          if (le == "español")
            return message.channel.send(
              "Este servidor ya tiene las reacciones deshabilitadas!"
            );
          else return message.channel.send("Reactions are already disabled!");
        } else {
          reaction.establecer(message.guild.id, "deshabilitadas");
          if (le == "español")
            message.channel.send(
              "Ya no añadire mas reacciones a las palabras que no empiecen con mi prefix :thumbsup:"
            );
          else
            message.channel.send(
              "I will not react to words that does not startwith my prefix :thumbsup:"
            );
        }
      } else if (args[1] === "on") {
        if (re == "habilitadas") {
          if (le == "español")
            return message.channel.send(
              "Este servidor ya tiene las reacciones habilitadas!"
            );
          else return message.channel.send("Reactions are already enabled!");
        }
        reaction.establecer(message.guild.id, "habilitadas");
        if (le == "español")
          message.channel.send(
            "Ahora reaccionaré a algunas palabras que no empiezen con mi prefix :thumbsup:"
          );
        else
          message.channel.send(
            "I will now react to words that does not start with my prefix :thumbsup:"
          );
      }
    } else if (command === "vote") {
      const topgg = new MessageEmbed();
      if (le == "español") {
        topgg
          .setTitle("Votame!")
          .setDescription(
            `Hola ${message.author.username}! Quieres votarme? Aquí hay unos links que te pueden servir!

[Top.gg](https://top.gg/bot/${client.user.id}/vote)

[Discord Bots (no vote)](https://discord.bots.gg/bots/${client.user.id})

[Discord Bot List](https://discordbotlist.com/bots/textbot/upvote)

[Discord Boats](https://discord.boats/bot/${client.user.id}/vote)`
          )
          .setColor(exito_color)
          .setFooter("Gracias por votarme")
          .setTimestamp()
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
      } else {
        topgg
          .setTitle("Vote me!")
          .setDescription(
            `Hi ${message.author.username}! Do you want to vote me? Here are some links that you can use!

[Top.gg](https://top.gg/bot/${client.user.id}/vote)

[Discord Bots (no vote)](https://discord.bots.gg/bots/${client.user.id})

[Discord Bot List](https://discordbotlist.com/bots/textbot/upvote)

[Discord Boats](https://discord.boats/bot/${client.user.id}/vote)

[SD Botlist](https://sdbotlist.glitch.me/bot/${client.user.id} `
          )
          .setColor(exito_color)
          .setFooter("Thanks for voting!")
          .setTimestamp()
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
      }
      message.channel.send(topgg);
    } else if (command === "lang") {
      if (le == "español") {
        if (!args[1])
          return message.channel.send(
            "El lenguaje en este servidor es `español`, puedes establecer un lenguaje con " +
              prefix +
              "lang (en/english). Por ahora son los únicos que hay."
          );
        else if (!message.member.permissions.has("MANAGE_GUILD"))
          return message.channel.send(
            "Necesitas permisos de gestionar servidor"
          );
        else if (
          args[1] == "es" ||
          args[1] == "español" ||
          args[1] == "españól"
        )
          return message.channel.send("Ese ya es mi lenguaje ._ .");
        else if (args[1] == "en" || args[1] == "english") {
          lang.establecer(message.guild.id, "english");
          message.channel.send("Mi language here is now `english` !");
        }
      } else if (le == "english")
        if (!args[1])
          return message.channel.send(
            "My language here is `english`, you can set a language with " +
              prefix +
              "lang (es/español). That are the only languages for now."
          );
        else if (!message.member.permissions.has("MANAGE_GUILD"))
          return message.channel.send(
            "You need manage server permissions to do this."
          );
        else if (args[1] == "en" || args[1] == "english")
          return message.channel.send("That's actually my language ._ .");
        else if (args[1] == "es" || args[1] == "español") {
          lang.establecer(message.guild.id, "español");
          message.channel.send("Mi lenguaje aquí ahora es `español` !");
        }
    } else if (command === "discordjs") {
      let src = "";
      let cont = "";
      if (!args[1]) {
        if (le == "español") return message.reply("Busca algo en discord.js!");
        else return message.reply("Search something on discord.js!");
      }
      if (
        [
          "stable",
          "master",
          "commando",
          "rpc",
          "akairo",
          "akairo-master",
          "collection"
        ].includes(args[1])
      ) {
        src = args[1];
        cont = args.slice(2).join(" ");
      } else {
        src = "stable";
        cont = args.slice(1).join(" ");
      }
      fetch(
        `https://djsdocs.sorta.moe/v2/embed?src=${encodeURIComponent(
          src
        )}&q=${encodeURIComponent(cont)}`
      )
        .then(r => r.json())
        .then(res => {
          message.channel.send(new MessageEmbed(res));
        })
        .catch(err => message.channel.send("Error: " + err));
    } else if (command === "imgsearch") {
      const cheerio = require("cheerio");

      const request = require("request");

      if (!args[1]) {
        if (le == "español") return message.reply("Debes buscar algo");
        else return message.reply("You have to search something");
      }

      image(message);

      async function image(message) {
        var options = {
          url:
            "http://results.dogpile.com/serp?qc=images&q=" +
            args.slice(1).join(" "),
          method: "GET",
          headers: {
            Accept: "text/html",
            "User-Agent": "Chrome"
          }
        };

        request(options, async function(error, response, responseBody) {
          if (error) {
            return;
          }
          $ = cheerio.load(responseBody);

          var links = $(".image a.link");

          //Crear las URLs
          var urls = new Array(links.length)
            .fill(0)
            .map((v, i) => links.eq(i).attr("href"));

          //Si no encontró nada, regresar con ese mensaje
          if (!urls.length) {
            if (le == "español") return message.reply("No encontré nada.");
            else return message.channel.send("I didn't find anything.");
          }

          //Establecer mínimo y máximo para evitar errores en el colector
          let i = 0;
          let max = urls.length - 1;
          //La mejor forma de hacer esto es por un embed :)
          const embed = new MessageEmbed();
          if (le == "español")
            embed
              .setTitle("Búsqueda imagen: " + args.slice(1).join(" "))
              .setDescription(
                `Usa las reacciones para mover de una imagen a otra`
              )
              .setFooter(`${i + 1}/${max + 1}`)
              .setImage(urls[i])
              .setColor("RANDOM");
          else
            embed
              .setTitle("Image search: " + args.slice(1).join(" "))
              .setDescription(
                `Use the reactions to move from one image to another`
              )
              .setFooter(`${i + 1}/${max + 1}`)
              .setImage(urls[i])
              .setColor("RANDOM");

          //Opciones de filtros
          const filter = (reaction, user) => {
            return (
              ["◀️", "▶️", "⏹️"].includes(reaction.emoji.name) &&
              user.id === message.author.id
            );
          };

          //Guardar el mensaje y reaccionar.
          let msg = await message.channel.send(embed);
          await msg.react("◀️");
          await msg.react("▶️");
          await msg.react("⏹️");

          //Hora de encender el colector, si está inactivo por 20 segundos  finalizar.
          let collector = msg.createReactionCollector(filter, { idle: 20000 });
          collector.on("collect", async (reaction, user) => {
            //Buscar cada reacción
            if (reaction.emoji.name === "▶️") {
              if (permisos.has("MANAGE_MESSAGES"))
                reaction.users.remove(user.id);
              if (max !== i) {
                //Modificar el embed
                i++;
                embed.setImage(urls[i]);
                embed.setFooter(`${i + 1}/${max + 1}`);
                await msg.edit(embed);
              }
            }
            if (reaction.emoji.name === "◀️") {
              await reaction.users.remove(user.id);
              if (i !== 0) {
                i--;
                embed.setImage(urls[i]);
                embed.setFooter(`${i + 1}/${max + 1}`);
                await msg.edit(embed);
              }
            }
            if (reaction.emoji.name === "⏹️") {
              //Detener el colector de manera voluntaria
              collector.stop();
            }
          });
          //Eliminar las reacciones
          collector.on("end", collected => {
            if (permisos.has("MANAGE_MESSAGES")) msg.reactions.removeAll();
          });
        });
      }
    } else if (command === "mirror") {
      let mention =
        message.mentions.users.first() ||
        client.users.cache.get(args[0]) ||
        message.author; // necesitaremos un usuario para sacar su avatar

      let avatar = mention.displayAvatarURL({
        size: 256,
        format: "png",
        dynamic: false
      });

      const canvas = Canvas.createCanvas(451, 679);
      const ctx = canvas.getContext("2d");

      let bg = await Canvas.loadImage(
        "https://cdn.discordapp.com/attachments/750461925099307129/753343100826550473/images.jpeg"
      );
      ctx.drawImage(bg, 0, 0);
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 500, 125, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.clip();

      let imagen = await Canvas.loadImage(avatar);
      ctx.drawImage(imagen, 100.5, 375);

      let att = new MessageAttachment(canvas.toBuffer(), "espejo.png");
      message.channel.send(att);
    } else if (command === "gstart") {
      if (le == "español") {
        if (!message.member.permissions.has("MANAGE_MESSAGES"))
          return message.channel.send(
            "Necesitas permisos de gestionar mensajes"
          );

        let giveawayChannel =
          message.mentions.channels.first() ||
          message.guild.channels.cache.get(args[1]);
        if (!giveawayChannel)
          return message.channel.send("Menciona algun canal");

        let giveawayDuration = args[2];
        if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
          return message.channel.send("Escribe alguna duracion");
        }
        let giveawayNumberWinners = args[3];
        if (
          isNaN(giveawayNumberWinners) ||
          parseInt(giveawayNumberWinners) <= 0
        )
          return message.channel.send("Especifica los ganadores");

        let giveawayPrize = args.slice(4).join(" ");
        if (!giveawayPrize) {
          return message.channel.send("Escribe el premio");
        }
        client.giveawaysManager.start(giveawayChannel, {
          time: ms(giveawayDuration),
          prize: giveawayPrize,
          winnerCount: giveawayNumberWinners,
          hostedBy: message.author,
          messages: {
            giveaway: "🎉 **GIVEAWAY** 🎉",
            giveawayEnded: "🎉 **GIVEAWAY TERMINADO** 🎉",
            timeRemaining: "Tiempo restante: **{duration}**!",
            inviteToParticipate: "Reacciona a 🎉 para participar!",
            winMessage: "Felicitaciones: {winners}! Has ganado **{prize}**!",
            embedFooter: "TextBot - Giveaways",
            noWinner: "Un ganador no pudo ser determinado!",
            hostedBy: "Hecho por: {user}",
            winners: "Ganador(es)",
            endedAt: "Terminó el",
            units: {
              seconds: "segundos",
              minutes: "minutos",
              hours: "horas",
              days: "días",
              pluralS: false
            }
          }
        });

        message.channel.send(
          `Giveaway comenzado en <#${giveawayChannel.id}> !`
        );
      } else {
        if (!message.member.permissions.has("MANAGE_MESSAGES"))
          return message.channel.send("You need manage messages permissions");

        let giveawayChannel =
          message.mentions.channels.first() ||
          message.guild.channels.cache.get(args[1]);
        if (!giveawayChannel) return message.channel.send("Mention a channel");

        let giveawayDuration = args[2];
        if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
          return message.channel.send("Type some duration");
        }
        let giveawayNumberWinners = args[3];
        if (
          isNaN(giveawayNumberWinners) ||
          parseInt(giveawayNumberWinners) <= 0
        )
          return message.channel.send("Type a number for the winners");

        let giveawayPrize = args.slice(4).join(" ");
        if (!giveawayPrize) return message.channel.send("Type the prize");

        client.giveawaysManager.start(giveawayChannel, {
          time: ms(giveawayDuration),
          prize: giveawayPrize,
          winnerCount: giveawayNumberWinners,
          hostedBy: message.author,
          messages: {
            giveaway: "🎉 **GIVEAWAY** 🎉",
            giveawayEnded: "🎉 **GIVEAWAY ENDED** 🎉",
            timeRemaining: "Time remaining: **{duration}**!",
            inviteToParticipate: "React to 🎉 to participate!",
            winMessage: "Congratulations: {winners}! You won **{prize}**!",
            embedFooter: "TextBot - Giveaways",
            noWinner: "A winner couldn't be determined!",
            hostedBy: "Hosted by: {user}",
            winners: "Winner(s)",
            endedAt: "Ended at",
            units: {
              seconds: "seconds",
              minutes: "minutes",
              hours: "hours",
              days: "days",
              pluralS: false
            }
          }
        });
        message.channel.send(`Giveaway started in <#${giveawayChannel.id}>!!`);
      }
    } else if (command === "gend") {
      if (le == "español") {
        if (!message.member.permissions.has("MANAGE_MESSAGES"))
          return message.channel.send(
            "Necesitas permisos de gestionar mensajes"
          );

        // If no message ID or giveaway name is specified
        if (!args[1])
          return message.channel.send("Especifica el mensaje ID del giveaway");

        // try to found the giveaway with prize then with ID
        let giveaway =
          // Search with giveaway prize
          client.giveawaysManager.giveaways.find(
            g => g.prize === args.slice(1).join(" ")
          ) ||
          // Search with giveaway ID
          client.giveawaysManager.giveaways.find(g => g.messageID === args[1]);

        // If no giveaway was found
        if (!giveaway)
          return message.channel.send(
            "No encontré el giveaway: `" + args.slice(1).join(" ") + "`."
          );

        // Edit the giveaway
        client.giveawaysManager
          .edit(giveaway.messageID, {
            setEndTimestamp: Date.now()
          })
          // Success message
          .then(() => {
            // Success message
            message.channel.send(
              "El giveaway terminará en " +
                client.giveawaysManager.options.updateCountdownEvery / 1000 +
                " segundos!"
            );
          })
          .catch(e => {
            if (
              e.startsWith(
                `Giveaway with message ID ${giveaway.messageID} is already ended.`
              )
            ) {
              message.channel.send("El giveaway ya había terminado!");
            } else {
              console.error(e);
              message.channel.send(
                `:x: \`|\` Ha ocurrido un error desconocido: Por favor usa **${prefix}discord** y reporta este error que aparece aquí: **\`\`\`js\n${e}\`\`\`** `
              );
            }
          });
      } else {
        if (!message.member.permissions.has("MANAGE_MESSAGES"))
          return message.channel.send("You need manage messages permissions");

        // If no message ID or giveaway name is specified
        if (!args[1])
          return message.channel.send("Type the message ID of the giveaway");

        // try to found the giveaway with prize then with ID
        let giveaway =
          // Search with giveaway prize
          client.giveawaysManager.giveaways.find(
            g => g.prize === args.slice(1).join(" ")
          ) ||
          // Search with giveaway ID
          client.giveawaysManager.giveaways.find(g => g.messageID === args[1]);

        // If no giveaway was found
        if (!giveaway)
          return message.channel.send(
            "I couldn't find the giveaway: `" + args.slice(1).join(" ") + "`."
          );

        // Edit the giveaway
        client.giveawaysManager
          .edit(giveaway.messageID, {
            setEndTimestamp: Date.now()
          })
          // Success message
          .then(() => {
            // Success message
            message.channel.send(
              "Giveaway will end in " +
                client.giveawaysManager.options.updateCountdownEvery / 1000 +
                " seconds!"
            );
          })
          .catch(e => {
            if (
              e.startsWith(
                `Giveaway with message ID ${giveaway.messageID} is already ended.`
              )
            ) {
              message.channel.send("Giveaway already ended!");
            } else {
              console.error(e);
              message.channel.send(
                `:x: \`|\` An error has ocurred, please use **${prefix}discord** and report this error: \`\`\`js\n${e}\`\`\``
              );
            }
          });
      }
    } else if (command === "greroll") {
      if (le == "español") {
        if (!message.member.permissions.has("MANAGE_MESSAGES"))
          return message.channel.send(
            "Necesitas permisos de gestionar mensajes"
          );
        if (!args[1]) return message.channel.send("Especifica un mensaje ID");

        let giveaway =
          (await client.giveawaysManager.giveaways.find(
            g => g.prize === args.slice(1).join(" ")
          )) ||
          // Search with giveaway ID
          (await client.giveawaysManager.giveaways.find(
            g => g.messageID === args[1]
          ));

        // If no giveaway was found
        if (!giveaway)
          return message.channel.send(
            "No encontré el giveaway: `" + args.slice(1).join(" ") + "`."
          );

        // Reroll the giveaway
        client.giveawaysManager
          .reroll(giveaway.messageID)
          .then(() => {
            // Success message
            message.channel.send("Sorteo rerolleado!");
          })
          .catch(e => {
            if (
              e.startsWith(
                `Giveaway with message ID ${giveaway.messageID} is not ended.`
              )
            ) {
              message.channel.send(
                "El giveaway todavía no termino! Para terminarlo usa **" +
                  prefix +
                  "gend " +
                  giveaway.messageID +
                  "**"
              );
            } else {
              console.error(e);
              message.channel.send(
                `:x: \`|\` Ha ocurrido un error desconocido: Por favor usa **${prefix}discord** y reporta este error que aparece aquí: **\`\`\`js\n${e}\`\`\`** `
              );
            }
          });
      } else {
        if (!message.member.permissions.has("MANAGE_MESSAGES"))
          return message.channel.send("You need manage messages permissions");
        if (!args[1])
          return message.channel.send("Type the message ID of the giveaway");

        let giveaway =
          (await client.giveawaysManager.giveaways.find(
            g => g.prize === args.slice(1).join(" ")
          )) ||
          // Search with giveaway ID
          (await client.giveawaysManager.giveaways.find(
            g => g.messageID === args[1]
          ));

        // If no giveaway was found
        if (!giveaway)
          return message.channel.send(
            "I couldn't find the giveaway: `" + args.slice(1).join(" ") + "`."
          );

        // Reroll the giveaway
        client.giveawaysManager
          .reroll(giveaway.messageID)
          .then(() => {
            // Success message
            message.channel.send("Giveaway rerolled!");
          })
          .catch(e => {
            if (
              e.startsWith(
                `Giveaway with message ID ${giveaway.messageID} is not ended.`
              )
            ) {
              message.channel.send(
                "The giveaway is not ended! To end it use **" +
                  prefix +
                  "gend " +
                  giveaway.messageID +
                  "**"
              );
            } else {
              console.error(e);
              message.channel.send(
                `:x: \`|\` An error has ocurred, please use **${prefix}discord** and report this error: \`\`\`js\n${e}\`\`\``
              );
            }
          });
      }
    } else if (command === "traduce") {
      const translate = require("node-google-translate-skidz");
      try {
        if (!args[3]) {
          if (le == "español")
            return message.channel.send(
              "Uso: `" +
                prefix +
                "traduce (lenguaje del texto) (lenguaje a traducir) (texto)`"
            );
          else
            return message.channel.send(
              "Usage: `" +
                prefix +
                "traduce (text language) (lanugage to traduce) (text)`"
            );
        }

        translate(
          {
            text: args.slice(3).join(" "),
            source: args[1],
            target: args[2]
          },
          function(result) {
            if (le == "español")
              message.channel.send(
                new MessageEmbed()
                  .setTitle("Traductor!")
                  .addField("Entrada", `\`\`\`${args.slice(3).join(" ")}\`\`\``)
                  .addField("Salida", `\`\`\`${result.translation}\`\`\``)
                  .setColor("#ff0000")
              );
            else
              message.channel.send(
                new MessageEmbed()
                  .setTitle("Traductor!")
                  .addField("Input", `\`\`\`${args.slice(3).join(" ")}\`\`\``)
                  .addField("Output", `\`\`\`${result.translation}\`\`\``)
                  .setColor("#ff0000")
              );
          }
        );
      } catch (err) {
        if (err.message.startsWith("Need a text to translate")) {
          if (le == "español")
            return message.channel.send(
              "Uso: `" +
                prefix +
                "traduce (lenguaje del texto) (lenguaje a traducir) (texto)`"
            );
          else
            return message.channel.send(
              "Usage: `" +
                prefix +
                "traduce (text language) (lanugage to traduce) (text)`"
            );
        }
      }
    } else if (command === "minecraft") {
      const minecraft = require("minecraft-server-util"),
        request = require("request");

      if (!args[1])
        return message.channel.send(
          "Escrie la IP del server de minecraft así veo la información"
        );
      let port = args[2];

      if (!port) port = 25565;

      let pingURL = `https://api.minetools.eu/ping/${args[1]}`;

      request(pingURL, function(err, resp, body) {
        if (err) return console.error(err);
        body = JSON.parse(body);
        if (body.error)
          return message.channel.send(
            "El servidor esta apagado o no se puede ver"
          );

        let url = `http://status.mclive.eu/MinecraftServer/${
          args[1]
        }/25565/banner.png`;

        minecraft.status(args[1], { port: port }).then(async res => {
          const mine = new MessageEmbed()
            .setTitle("Estadísticas del server")
            .addField("IP del server", res.host)
            .addField("Versión", res.version)
            .addField("Ping", body.latency)
            .addField("Descripción", res.description.descriptionText)
            .addField("Jugadores", res.onlinePlayers + " de " + res.maxPlayers)
            .setColor(exito_color)
            .setImage(url);
          if (res.description.descriptionText == "§4Server not found.")
            return message.channel.send(
              ":x: `|`El servidor de minecraft no existe!"
            );

          message.channel.send(mine);
        });
      });
    } else if (command === "ad") {
      const publicidad = new MessageEmbed()
        .setTitle(":partying_face: ANUNCIO! :partying_face:")
        .setDescription(
          `Quieres un bot que tenga diversión y mas categorías?

Prueba a skormy! Un bot en progreso pero con comandos para divertirse, con skormy no te aburriras, ya que tiene demasiadas categorías que puedes descubrir, además de que tiene comandos secretos :o, mete a skormy y diviértete con el probando y descubriendo sus comandos!

Invitalo a tu server:
[link](https://top.gg/bot/779918057027665960)`
        )
        .setColor(exito_color);
      message.channel.send(publicidad);
    } else if (command === "usay" || command === "usersay") {
      if (le == "español") {
        let miembro = message.mentions.members.first() || message.member;

        let mensaje;

        if (miembro == message.member) {
          mensaje = args.slice(1).join(" ");
        }
        if (miembro == message.mentions.members.first()) {
          mensaje = args.slice(2).join(" ");
        }

        if (!mensaje) return message.channel.send("Pon un mensaje");

        const canvas = await Canvas.createCanvas(400, 69);
        const ctx = await canvas.getContext("2d");
        ctx.fillStyle = "#36393f";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let x = 11;
        let y = 13;
        let radius = 20;
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const url = miembro.user.displayAvatarURL({
          format: "png",
          dynamic: false,
          size: 1024
        });
        const image = await Canvas.loadImage(url);
        ctx.drawImage(image, x, y, radius * 2, radius * 2);
        ctx.restore();
        ctx.lineWidth = 0.3;
        ctx.font = "14px Sans Serif";
        ctx.fillStyle = miembro.roles.color.hexColor || "#000";
        ctx.strokeStyle = miembro.roles.color.hexColor || "#000";
        ctx.strokeText(miembro.nickname || miembro.user.username, 66, 27);
        ctx.fillText(miembro.nickname || miembro.user.username, 66, 27);
        let largo = ctx.measureText(miembro.nickname || miembro.user.username)
          .width;
        ctx.font = "11.2px Sans Serif";
        ctx.fillStyle = "#72767d";
        let hour = Math.floor(Math.random() * 12);
        let min = Math.floor(Math.random() * 60);
        const t = ["AM", "PM"];
        const tt = t[Math.floor(Math.random() * t.length)];
        hour = (hour < 10 ? "0" : "") + hour;
        min = (min < 10 ? "0" : "") + min;
        ctx.fillText(`Hoy a las ${hour}:${min} ${tt}`, 66 + largo + 8, 27);
        ctx.lineWidth = 0.1;
        ctx.font = "14.5px Whitney";
        ctx.fillStyle = "#dcddde";
        ctx.strokeStyle = "#dcddde";
        let w =
          ctx.measureText(mensaje).width -
          Math.floor(ctx.measureText(mensaje).width * 0.08);
        ctx.strokeText(mensaje, 66, 50, w);
        ctx.fillText(mensaje, 66, 50, w);
        const say = new MessageAttachment(canvas.toBuffer(), "say.png");
        message.channel.send(say);
      } else {
        let miembro = message.mentions.members.first() || message.member;

        let mensaje;

        if (miembro == message.member) {
          mensaje = args.slice(1).join(" ");
        }
        if (miembro == message.mentions.members.first()) {
          mensaje = args.slice(2).join(" ");
        }

        if (!mensaje) return message.channel.send("Please put a message!");

        const canvas = await Canvas.createCanvas(400, 69);
        const ctx = await canvas.getContext("2d");

        //Fondo
        ctx.fillStyle = "#36393f";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Circulo para cortar el avatar
        const x = 11,
          y = 13,
          radius = 20;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        //Avatar
        const url = miembro.user.displayAvatarURL({
          format: "png",
          dynamic: false,
          size: 1024
        });
        const image = await Canvas.loadImage(url);
        ctx.drawImage(image, x, y, radius * 2, radius * 2);

        ctx.restore();

        //Estas fueron las fuentes que probé
        //Whitney,Helvetica Neue,Helvetica,Arial o sans-serif

        //Nickname
        ctx.lineWidth = 0.3;
        ctx.font = "14px Sans Serif";
        ctx.fillStyle = miembro.roles.color.hexColor || "#000";
        ctx.strokeStyle = miembro.roles.color.hexColor || "#000";
        ctx.strokeText(miembro.nickname || miembro.user.username, 66, 27);
        ctx.fillText(miembro.nickname || miembro.user.username, 66, 27);

        //Timestamp (el cual es completamente al azar)
        let largo = ctx.measureText(miembro.nickname || miembro.user.username)
          .width;
        ctx.font = "11.2px Sans Serif";
        ctx.fillStyle = "#72767d";

        let hour = Math.floor(Math.random() * 12);
        let min = Math.floor(Math.random() * 60);
        const t = ["AM", "PM"];
        const tt = t[Math.floor(Math.random() * t.length)];

        hour = (hour < 10 ? "0" : "") + hour;
        min = (min < 10 ? "0" : "") + min;

        ctx.fillText(`Today at ${hour}:${min} ${tt}`, 66 + largo + 8, 27);

        //Mensaje
        ctx.lineWidth = 0.1;
        ctx.font = "14.5px Whitney";
        ctx.fillStyle = "#dcddde";
        ctx.strokeStyle = "#dcddde";
        let w =
          ctx.measureText(mensaje).width -
          Math.floor(ctx.measureText(mensaje).width * 0.08);
        ctx.strokeText(mensaje, 66, 50, w);
        ctx.fillText(mensaje, 66, 50, w);

        const attach = new MessageAttachment(canvas.toBuffer(), "isay.png");
        message.channel.send(attach);
      }
    } else if (command === "structure") {
      let bug = "si";
      if (bug == "si")
        return message.channel.send("Temporalmente deshabilitado!");
      let algo = "";
      let miembro =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[1]) ||
        message.guild.members.cache.find(
          m => m.nickname === args.slice(1).join(" ")
        ) ||
        message.guild.members.cache.find(
          m => m.user.tag === args.slice(1).join(" ")
        ) ||
        message.guild.members.cache.find(
          m => m.user.username === args.slice(1).join(" ")
        );
      let algo2;
      if (miembro) {
        algo2 = message.guild.channels.cache.filter(c =>
          c.type === "category"
            ? c.children.some(r =>
                r.permissionsFor(miembro).has("VIEW_CHANNEL")
              )
            : c.permissionsFor(miembro).has("VIEW_CHANNEL")
        );
      } else {
        if (args[1]) miembro = await message.guild.members.fetch(args[1]);
        if (miembro)
          algo2 = message.guild.channels.cache.filter(c =>
            c.type === "category"
              ? c.children.some(r =>
                  r.permissionsFor(miembro).has("VIEW_CHANNEL")
                )
              : c.permissionsFor(miembro).has("VIEW_CHANNEL")
          );
        else algo2 = message.guild.channels.cache;
      }
      const xd = Util.discordSort(
        algo2.filter(c => !c.parent && c.type !== "category")
      );
      const textnp = xd.filter(c => ["text", "store", "news"].includes(c.type));
      const voice = xd.filter(c => c.type === "voice");
      if (xd.size >= 1) {
        algo += textnp.map(advancedmap).join("\n");
        algo += voice.map(advancedmap).join("\n");
      }
      let cats = Util.discordSort(algo2.filter(c => c.type === "category"));
      cats.forEach(c => {
        const children = c.children.intersect(algo2);
        const textp = children.filter(c =>
          ["text", "store", "news"].includes(c.type)
        );
        const voicep = children.filter(c => c.type === "voice");
        algo += "\n[▼] 📂 " + c.name;
        algo += textp.size
          ? "\n\t" +
            Util.discordSort(textp)
              .map(advancedmap)
              .join("\n\t")
          : "";
        algo += voicep.size
          ? "\n\t" +
            Util.discordSort(voicep)
              .map(advancedmap)
              .join("\n\t")
          : "";
      });
      const split = Util.splitMessage(algo);
      for (let i in split) {
        await message.channel.send(
          "\nEstructura de canales de " +
            message.guild.name +
            (miembro ? " para " + miembro.user.tag : ""),
          { code: split[i] }
        );
      }
      function advancedmap(c) {
        let r = "";
        switch (c.type) {
          case "news":
          case "text":
            r += "[💬] " + c.name;
            break;
          case "voice":
            r +=
              "[🔊] " +
              c.name +
              (c.members.size
                ? c.members
                    .map(d => {
                      if (d.user.bot) {
                        return "\n\t\t[🤖] " + d.user.tag;
                      } else {
                        return "\n\t\t[👤] " + d.user.tag;
                      }
                    })
                    .join("")
                : "");
            break;
          case "store":
            r += "[🛒] " + c.name;
            break;
          default:
            r += "[Desconocido] " + c.name;
            break;
        }
        return r;
      }
    }
  } catch (error) {
    console.error(error);
    let le = (await lang.obtener(message.guild.id)) || "español";
    if (le == "español")
      return message.channel.send(
        `:x: \`|\` Ha ocurrido un error desconocido: Por favor usa **${prefix}discord** y reporta este error que aparece aquí: **\`\`\`js\n${error}\`\`\`** `
      );
    else
      return message.channel.send(
        `:x: \`|\` An error has ocurred, please use **${prefix}discord** and report this error: \`\`\`js\n${error}\`\`\``
      );
  }
});

client.on("guildCreate", async guild => {
  const ilucklogs = await client.users.resolve("770438761162080291");
  let verifLevels = {
      NONE: "Ninguno",
      LOW: "Debe tener un correo verificado en discord",
      MEDIUM: "Debe estar registrado en Discord por más de 5 minutos.",
      HIGH: "Debe llevar en el servidor por más de 10 minutos",
      VERY_HIGH: "Debe tener un teléfono verificado en Discord"
    },
    region = {
      europe: "Europa :flag_eu:",
      brazil: "Brasil :flag_br: ",
      hongkong: "Hong Kong :flag_hk:",
      japan: "Japón :flag_jp:",
      russia: "Rusia :flag_ru:",
      singapore: "Singapur :flag_sg:",
      southafrica: "Sudáfrica :flag_za:",
      sydney: "Sydney :flag_au:",
      "us-central": "EE.UU Central :flag_us:",
      "us-east": " Este de EE.UU:flag_us:",
      "us-south": "Sur de EE.UU :flag_us:",
      "us-west": "Oeste de EE.UU :flag_us:",
      "vip-us-east": "VIP EE.UU Este :flag_us:",
      "eu-central": "Europa Central :flag_eu:",
      "eu-west": "Europa Oeste :flag_eu:",
      london: "London :flag_gb:",
      amsterdam: "Amsterdam :flag_nl:",
      india: "India :flag_in:"
    };
  const iluckembed = new ILuck.MessageEmbed()
    .setTitle("Estoy en un nuevo server: " + guild.name)
    .setDescription(
      `Usuarios: ${guild.members.cache.size}
 
 Región: ${region[guild.region]}
 
 Nivel de verificación: ${verifLevels[guild.verificationLevel]}
 
 ID: ${guild.id}
 
 Emojis: ${guild.emojis.cache.size}

 Roles: ${guild.roles.cache.size}

 Canales: ${guild.channels.cache.filter(x => x.type !== "category").size}

 Gracias a este server estoy en ${client.guilds.cache.size} servers!`
    ) // Descripcion
    .setColor(exito_color);
  if (!ilucklogs) return;

  ilucklogs.send(iluckembed); // Enviamos el embed
});

client.on("guildDelete", async guild => {
  let verifLevels = {
      NONE: "Ninguno",
      LOW: "Debe tener un correo verificado en discord",
      MEDIUM: "Debe estar registrado en Discord por más de 5 minutos.",
      HIGH: "Debe llevar en el servidor por más de 10 minutos",
      VERY_HIGH: "Debe tener un teléfono verificado en Discord"
    },
    region = {
      europe: "Europa :flag_eu:",
      brazil: "Brasil :flag_br: ",
      hongkong: "Hong Kong :flag_hk:",
      japan: "Japón :flag_jp:",
      russia: "Rusia :flag_ru:",
      singapore: "Singapur :flag_sg:",
      southafrica: "Sudáfrica :flag_za:",
      sydney: "Sydney :flag_au:",
      "us-central": "EE.UU Central :flag_us:",
      "us-east": " Este de EE.UU:flag_us:",
      "us-south": "Sur de EE.UU :flag_us:",
      "us-west": "Oeste de EE.UU :flag_us:",
      "vip-us-east": "VIP EE.UU Este :flag_us:",
      "eu-central": "Europa Central :flag_eu:",
      "eu-west": "Europa Oeste :flag_eu:",
      london: "London :flag_gb:",
      amsterdam: "Amsterdam :flag_nl:",
      india: "India :flag_in:"
    };
  const ilucklogs = await client.users.resolve("770438761162080291");
  const iluckembed2 = new ILuck.MessageEmbed()
    .setTitle("Me quitaron de un server: " + guild.name)
    .setDescription(
      `Usuarios: ${guild.members.cache.size}
 
 Región: ${region[guild.region]}
 
 Nivel de verificación: ${verifLevels[guild.verificationLevel]}
 
 ID: ${guild.id}
 
 Emojis: ${guild.emojis.cache.size}

 Roles: ${guild.roles.cache.size}

 Canales: ${guild.channels.cache.filter(x => x.type !== "category").size}

 Ahora estoy en ${client.guilds.cache.size} servers`
    ) // Descripcion
    .setColor(exito_color);
  ilucklogs.send(iluckembed2);
});

client.on("guildMemberAdd", async member => {
  let canal = await bienvenidas.obtener(member.guild.id);

  let canal_guardado = member.guild.channels.cache.find(c => c.id == canal);

  if (!canal_guardado) return;

  const hola = new MessageEmbed()
    .setTitle("Nuevo usuario!")
    .setDescription(
      `Hola! Bienvenido ${member.user.username}!!!
Has llegado por fin a ${member.guild.name}!!!
Esperamos que la pases muyyyyyy bien!!!!
Contigo somos: ${member.guild.members.cache.size}!!!`
    )

    .setThumbnail(member.user.displayAvatarURL())

    .setImage(
      "https://cdn.discordapp.com/attachments/751798058907467820/767749257129230336/Bienvenido.png"
    )

    .setTimestamp()

    .setColor(exito_color);

  canal_guardado.send(hola);
});
