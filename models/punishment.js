const { Schema, model } = require("mongoose")

const newSchema = Schema({
    userId: String,
    modId: String,
    punishment: String,
    guildId: String,
    date: {
        type: Date,
        default: Date.now
    },
    reason: String,
    status: {
        type: String,
        default: 'None'
    }
})

module.exports = model('Punishment', newSchema, 'punishments')