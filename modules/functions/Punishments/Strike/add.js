const punishModal = require("../../../../models/punishment")
module.exports = {
    run: async (interaction) => {
        const target = interaction.options.getUser("target")
        const reason = interaction.options.getString("reason")

        const newPunishment = new punishModal({
            userId: target.id,
            modId: interaction.user.id,
            punishment: 'Strike',
            reason: reason,
            guildId: interaction.guild.id
        })

        await newPunishment.save()
        return newPunishment
    }
}