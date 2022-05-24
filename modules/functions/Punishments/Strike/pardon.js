const punishModal = require("../../../../models/punishment")
module.exports = {
    run: async (interaction, id) => {
        const target = interaction.options.getUser("target")

        if (id.length != 24) return { error: true }

        let oldDB;
        let pardonDB = await punishModal.findOne({ _id: id })

        if (!pardonDB) return { error: true }

        if (pardonDB.punishment == "Ban") {
            
        }
        oldDB = pardonDB
        await pardonDB.delete()
        return oldDB
    }
}