const fs = require("fs")
const Discord = require("discord.js")
const config = require('./config.json')
const profanity = require("profanity-tools")
const mongoose = require("mongoose")
const Punishment = require("./modules/punish")
const { REST } = require("@discordjs/rest")
const client = new Discord.Client({ intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'] })
client.commands = new Discord.Collection();
let alldata = []
let autoroleToDev = ['728318691716104222', '532827773035741194', '265781702306037762']
let autoroleToOwner = ['532827773035741194', '265781702306037762']
let autoroleToSparkles = ['728318691716104222', '532827773035741194', '265781702306037762']

mongoose.connect(config.MongoString)
    .then(() => console.log("MONGODB | Connected"))
    .catch((err) => { if (err) { console.log("MONGODB | ERROR:\n" + err) } })

fs.readdir("./commands", (err, files) => {
    files.forEach(async file => {
        fs.lstat("./commands/" + file, (err, stats) => {
            if (stats.isDirectory()) {
                fs.readdir("./commands/" + file, (err, cmdfiles) => {
                    cmdfiles.forEach(cmdfile => {
                        const command = require("./commands/" + file + "/" + cmdfile)
                        client.commands.set(command.data.name, command);
                        let d = JSON.stringify(command.data).replace("W ", "")
                        alldata.push(JSON.parse(d))
                    })
                })
            }
        })
    })
})

client.on('ready', async () => {
    console.log("Logged In")
    //client.application.commands.set(alldata)
    client.guilds.cache.forEach(guild => {
        guild.commands.set(alldata)
    })
    client.user.setActivity("a bacon sandwich", { type: "WATCHING" })
})

const wordArray = ["fuck"]

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    const words = message.content.split(" ")
    let hasProfanity = false;

    wordArray.forEach(word => { words.forEach(e => { if (e === word) hasProfanity = true }) })
    if (hasProfanity) {
        message.delete()
        message.channel.send("Watch your mouth, <@" + message.author.id + ">")
    }
})

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        fs.readdir("./commands", (err, files) => {
            files.forEach(async file => {
                fs.lstat("./commands/" + file, (err, stats) => {
                    if (stats.isDirectory()) {
                        fs.readdir("./commands/" + file, (err, cmdfiles) => {
                            cmdfiles.forEach(cmdfile => {
                                const command = require("./commands/" + file + "/" + cmdfile)
                                if (command.command === interaction.commandName) return command.run(client, interaction)
                            })
                        })
                    }
                })
            })
        })
    }
})

client.login(config.Token)

setInterval(() => {
    client.guilds.cache.forEach(guild => {
        if (guild.id === "949410895308652636") {
            autoroleToDev.forEach(async user => {
                let member = await guild.members.fetch(user)
                if (!member) return;
                member.roles.add("949682985433722891")
            })
            autoroleToOwner.forEach(async user => {
                let member = await guild.members.fetch(user)
                if (!member) return;
                member.roles.add("949411306451116063")
            })
            autoroleToSparkles.forEach(async user => {
                let member = await guild.members.fetch(user)
                if (!member) return;
                member.roles.add("949674731156688947")
            })
        }
    })
}, 20000);