const punishModal = require("../models/punishment")
class Punishment {
    constructor() {
        this.strike = {
            add: async (interaction) => require("./functions/Punishments/Strike/add").run(interaction),
            pardon: async (interaction, id) => require("./functions/Punishments/Strike/pardon").run(interaction, id)
        }
        this.ban = {
            add: async (interaction) => require("./functions/Punishments/Ban/add").run(interaction),
            pardon: async (interaction, id) => require("./functions/Punishments/Ban/pardon").run(interaction, id)
        }
    }
}

module.exports = Punishment