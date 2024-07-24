const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()


const membreModel = require('./membreModel');

const foyerSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: [true, "le mail est requis"],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
            },
            message: "le mail  doit contenir des caracteres valides"
        }
    },
    password: {
        type: String,
        required: [true, "le password est requis"],
        validate: {
            validator: function (value) {
                return /^(?=.*\d).{8,}$/.test(value);
            },
            message: "le password doit contenir des caracteres valides"
        }
    },
    membres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'membres' }],
    liste_Courses: 
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }],
    tdl: 
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'tdl' }],
    recettes: 
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recettes' }],
    pieces: 
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'pieces' }],

})


foyerSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, parseInt(process.env.SALT))
    }
    next()
})

foyerSchema.pre("validate", async function (next) {
    try {
        const existingFoyer = await this.constructor.findOne({ email: this.email });
        if (existingFoyer) {
            this.invalidate("email", "Cet email est déjà enregistré."); 
        }
        next();
    } catch (error) {
        next(error);
    }
   
});
foyerSchema.pre("validate", async function (next) {
    try {
        const existingFoyer = await this.constructor.findOne({ name: this.name });
        if (existingFoyer) {
            this.invalidate("email", "Cet email est déjà enregistré."); 
        }
        next();
    } catch (error) {
        next(error);
    }
   
});
const foyerModel = mongoose.model('foyers', foyerSchema)

module.exports = foyerModel