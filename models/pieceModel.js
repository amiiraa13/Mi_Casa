const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()


const pieceSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Le nom est requis"],
        
    },
    menages: 
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'menages' }],
    
    
})

const pieceModel = mongoose.model('pieces', pieceSchema);
module.exports = pieceModel