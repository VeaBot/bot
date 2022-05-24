const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const punishments = require("../../modules/punish")

module.exports = {
    command: "ban",
    description: "Bans a user from the guild",
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the guild')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user you would like to ban")
                .setRequired(true)
            ),
    run: async (client, interaction) => {

        interaction.deferReply()

        const p = new punishments().ban.add(interaction)

        if (p.error) return interaction.followUp({ content: 'I am not able to ban this user' })
        const doneEmbed = new Discord.MessageEmbed()
            .setTitle("User Banned")
            .setDescription(`Punishment added <@${interaction.user.id}>`)
            .addField("Punishment", "Ban", true)
            .addField("Reason", p.reason, true)
            .addField("Moderator", `<@${interaction.user.id}>`, true)
            .setFooter({ text: `Powered by Vea | Moderation action performed by ${interaction.user.tag}`, iconURL: `https://cdn.upload.systems/uploads/RQ9oc7zO.png` })
            .setColor("GREEN")

        interaction.followUp({ embeds: [doneEmbed] })


    }
}
 