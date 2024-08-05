
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()


const menageSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Le nom est requis"],
    },
    
    recurrence: {
        type: String,
        enum: ["daily", "weekly", "monthly", "seasonally"],
        required: [true, "Le type de récurrence est requis"],
    },
})

const menageModel = mongoose.model('menages', menageSchema)

module.exports = menageModel