const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const punishments = require("../../models/punishment")
const punish = require("../../modules/punish")

module.exports = {
    command: "pardon",
    description: "Pardon a punishment made",
    data: new SlashCommandBuilder()
        .setName('pardon')
        .setDescription('Removed a punishment from the record of a user')
        .addStringOption(option =>
            option.setName("id")
                .setDescription("The ID of the punishment you would like to pardon")
                .setRequired(true)
            ),
    run: async (client, interaction) => {

        await interaction.deferReply()

        const id = interaction.options.getString("id")
        
        const record = await new punish().strike.pardon(interaction, id)

        if (record.error) return interaction.followUp({ content: "That is not a valid punishment ID" })

        const completed = new Discord.MessageEmbed()
            .setTitle("Punishment Pardoned")
            .setDescription(`\`${record.punishment}\` with the ID \`${record.id}\` has been pardoned from <@${record.userId}>`)
            .setColor("GREEN")

        interaction.followUp({ embeds: [completed] })

    }
}