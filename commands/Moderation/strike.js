const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const Punishment = require("../../modules/punish")

module.exports = {
    command: "strike",
    description: "Strike a user",
    data: new SlashCommandBuilder()
        .setName('strike')
        .setDescription('Strike a user')
        .addUserOption(option =>
            option.setName("target")
                .setDescription("The target you would like to strike")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("The reason for giving a strike")
                .setRequired(true)),
    run: async (client, interaction) => {
        await interaction.deferReply()

        if (interaction.options.getString("reason").length > 150) return interaction.followUp({ content: 'Your reason needs to be less than 150 characters' })

        let strike = await new Punishment().strike.add(interaction)

        const finished = new Discord.MessageEmbed()
            .setTitle(`Strike Given`)
            .setDescription(`Punishment added to <@${strike.userId}>`)
            .addField(`Punishment`, strike.punishment, true)
            .addField(`Reason`, strike.reason, true)
            .addField(`Moderator`, `<@${interaction.user.id}>`, true)
            .setColor("GREEN")
            .setFooter({ text: `Powered by Vea | Moderation action performed by ${interaction.user.tag}`, iconURL: `https://cdn.upload.systems/uploads/RQ9oc7zO.png` })

        interaction.editReply({ embeds: [finished] })
    }
}