const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()


const pieceSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Le nom est requis"],
        
    },
    tache_menage: 
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'tache_menage' }],
    
    
})

const pieceModel = mongoose.model('pieces', pieceSchema);
module.exports = pieceModel