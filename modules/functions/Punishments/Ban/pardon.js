const punishModal = require("../../../../models/punishment")
module.exports = {
    run: async (interaction, id) => {
        const target = interaction.options.getUser("target")
        let oldDB;
        let pardonDB = await punishModal.findOne({
            id: id
        })
        const ban = await interaction.guild.members.unban(pardonDB.userId)

        if (!pardonDB) return { error: true }
        oldDB = pardonDB
        await pardonDB.delete()
        return oldDB
    }
}