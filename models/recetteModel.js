const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

module.exports = recetteModel

const recetteSchema = new mongoose.Schema({
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
    ingredients: {
        type: String,
        required: [true, "Les ingredients sont requis"],
        
    },
    instructions: {
        type: String,
        required: [true, "Les instructions sont requis"],
        
    },
    
})




const recetteModel = mongoose.model('Recettes', recetteSchema)