const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()




const membreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom est requis"],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z]{3,29}$/.test(value);
            },
            message: "le nom doit contenir des caracteres valides"
        }
    },
    role: {
        type: String,
        required: [true, "Le role est requis"],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z]{3,29}$/.test(value);
            },
            message: "le role doit contenir des caracteres valides"
        }
    },
    tache: 
    [{ type: mongoose.Schema.Types.ObjectId, ref: 'menages' }],
    
    
})

const membreModel = mongoose.model('membres', membreSchema);
module.exports = membreModel