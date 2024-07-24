const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const tdlSchema = new mongoose.Schema({
    tache: {
        type: String,
        required: [true, "La tache est requise"],
        
    },
    
})


const tdlModel = mongoose.model('tdl', tdlSchema);
module.exports = tdlModel