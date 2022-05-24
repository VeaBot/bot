const punishModel = require("../../../../models/punishment")
module.exports = {
    run: async (interaction) => {
        const target = interaction.options.getMember("target")
        const reason = interaction.options.getString("reason")

        if (!target.bannable) return { error: true }
        await target.ban({ reason: reason })

        const newPunishment = new punishModel({
            userId: target.id,
            modId: interaction.user.id,
            punishment: 'Ban',
            reason: reason,
            guildId: interaction.guild.id
        })

        await newPunishment.save()
        return newPunishment
    }
}