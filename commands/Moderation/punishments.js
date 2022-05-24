const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const punishments = require("../../models/punishment")

module.exports = {
    command: "punishments",
    description: "View the punishments for a certain user",
    data: new SlashCommandBuilder()
        .setName('punishments')
        .setDescription('View the punishments for a certain user')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user which you would like to view the punishments for")
                .setRequired(false))
        .addStringOption(option =>
            option.setName("id")
                .setDescription("The ID of the punishment you would like to inspect")
            ),
    run: async (client, interaction) => {

        await interaction.deferReply()

        if (interaction.options.getString("id") && interaction.options.getUser("user")) return interaction.followUp({ content: "You cannot include both the user and ID parameters" })

        if (interaction.options.getString("id")) {

            if(interaction.options.getString("id").length != 24) return interaction.followUp({ content: "You did not provide a valid punishment ID" })

            const record = await punishments.findById(interaction.options.getString("id"))

            if(!record) return interaction.followUp({ content: 'You did not provide a valid punishment ID' })

            const punishmentDate = new Date(record.date)
            const timestamp = Math.floor(punishmentDate.getTime()/1000)

            const punishmentEmbed = new Discord.MessageEmbed()
                .setTitle(record.punishment)
                .setDescription(`**User:** <@${record.userId}>\n**Moderator:** <@${record.modId}>\n**Status:** ${record.status}\n**Date Issued:** <t:${timestamp}>\n**ID:** ${record.id}`)
                .setColor("GREEN")
                
            return interaction.followUp({ embeds: [punishmentEmbed] })
        }

        const user = interaction.options.getUser("user") || interaction.user

        const p = await punishments.find({
            userId: user.id,
            guildId: interaction.guild.id
        })

        const embeds = []

        let count = 0
        let currentEmbed
        let strikeCount = 0
        let kickCount = 0
        let banCount = 0
        let currentPage = 0
        let tCount = 0
        let pager = 0

        p.forEach(punish => {
            if (punish.punishment == "Strike") strikeCount += 1
            if (punish.punishment == "Kick") kickCount += 1
            if (punish.punishment == "Ban") banCount += 1
            if (count > 5) {
                tCount+= 1
            }
            count += 1
        })

        count = 0

        p.forEach((punish) => {
            if (count > 5) {
                embeds.push(currentEmbed)
                count = 0
                pager += 1
            }
            if (count == 0) {
                currentEmbed = new Discord.MessageEmbed().setAuthor({ name: user.tag, iconURL: user.avatarURL({ dynamic: true }) }).setTitle(`Punishment list - Page ${pager+1} of ${tCount+1}`) .setColor("GREEN")
            }

            const punishmentDate = new Date(punish.date)
            const timestamp = Math.floor(punishmentDate.getTime()/1000)

            currentEmbed.addField(`${punish.punishment}`, `**Reason:** ${punish.reason}\n**Moderator:** <@${punish.modId}>\n**Status:** ${punish.status}\n**Date Issued:** <t:${timestamp}>\n**ID:** ${punish.id}`, true)

            currentEmbed.setFooter({text: `${user.username} has got ${strikeCount} strikes, ${kickCount} kicks and ${banCount} bans.`})

            count += 1
        })

        if (count > 0) embeds.push(currentEmbed)

        if (embeds.length === 0) {
           embeds.push(new Discord.MessageEmbed().setTitle(`Punishment list for ${user.tag}`).setColor("GREEN").setDescription("This user does not have any punishments."))
        }



        

        const newRow = () => {
            const row = new Discord.MessageActionRow()
            row.addComponents(
                new Discord.MessageButton()
                    .setCustomId(`prev-page-${interaction.id}`)
                    .setStyle("SUCCESS")
                    .setEmoji("⏪")
                    .setDisabled(currentPage == 0)
            )
            row.addComponents(
                new Discord.MessageButton()
                    .setCustomId(`next-page-${interaction.id}`)
                    .setStyle("SUCCESS")
                    .setEmoji("⏩")
                    .setDisabled(currentPage == embeds.length - 1)
            )

            return row
        }

        const msg = await interaction.followUp({ embeds: [embeds[0]], components: [newRow()] })

        const filter = i => i.user.id == interaction.user.id

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 })

        collector.on('collect', async btn => {
            if (!btn) return
            if (btn.customId == `prev-page-${interaction.id}`) {
                btn.deferUpdate()
                currentPage -= 1
                await msg.edit({ embeds: [embeds[currentPage]], components: [newRow()] })
            }

            if(btn.customId == `next-page-${interaction.id}`) {
                btn.deferUpdate()
                currentPage += 1
                await msg.edit({ embeds: [embeds[currentPage]], components: [newRow()] })
            }
        })
        collector.on('end', async (btn) => {
            await msg.edit({ embeds: [new Discord.MessageEmbed().setTitle("Out of Time").setColor("GREEN").setDescription("This interaction has been expired. Please redo the command to continue.")], components: [] })
        })
        collector.on('error', async (err) => {
            await msg.edit({ embeds: [new Discord.MessageEmbed().setTitle("Sorry!").setColor("GREEN").setDescription("There was an issue. Please redo the command.")] })
        })
    }
}