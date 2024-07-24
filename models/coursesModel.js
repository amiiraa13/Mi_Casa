const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const coursesSchema = new mongoose.Schema({
    produit: {
        type: String,
        required: [true, "Le produit est requis"],
        
    },
    produit_select: {
        type: Boolean,
        
    },
    
    
})


const coursesModel = mongoose.model('courses', coursesSchema);
module.exports = coursesModel