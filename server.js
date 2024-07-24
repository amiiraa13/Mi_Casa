const express = require("express")
const mongoose = require('mongoose')
const session = require('express-session')
const foyerRouter = require("./routes/foyerRouter")
const membreRouter = require("./routes/membreRouter")
const coursesRouter = require("./routes/coursesRouter")
const tdlRouter = require("./routes/tdlRouter")
const pieceRouter = require("./routes/pieceRouter")

require('dotenv').config()

const app = express()

app.use(express.static('./publics'))
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: process.env.CRYPTSESS
}))

app.use(express.urlencoded({extended: true}))

app.use(foyerRouter)
app.use(membreRouter)
app.use(coursesRouter)
app.use(tdlRouter)
app.use(pieceRouter)





app.listen(process.env.PORT, (err)=>{
    if (err) {
        console.log(err);
    }else{
        console.log("connecté");
    }
})

mongoose.connect(process.env.MONGO)


app.get("*",(req,res)=>{
    res.redirect("/dashboard")
})