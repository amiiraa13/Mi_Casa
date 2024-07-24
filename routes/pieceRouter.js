const authGuard = require('../middleware/authGuard'); 
const bcrypt = require('bcrypt'); 
const pieceRouter = require('express').Router(); 
const foyerModel = require("../models/foyerModel");
const pieceModel = require("../models/pieceModel");


pieceRouter.get('/menage', authGuard, async (req, res) => {
    
    try {
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('pieces'); // Recherche le foyer et peuple la liste des courses
        console.log(foyerFinded);
        res.render('pages/menage.twig', {
            foyer: foyerFinded// Rend la vue "menage.twig" avec les données du foyer
            
        });
    } catch (error) {
        res.status(500).send(error.message); // Renvoie une réponse d'erreur en cas d'échec
    }
});


pieceRouter.post("/menage", authGuard, async (req, res) => {
    try {
        const newPiece = new pieceModel(req.body); // Crée une nouvelle instance de Piece avec les données du formulaire
        newPiece.validateSync(); // Valide les données du piece
        await newPiece.save(); // Sauvegarde le nouveau piece dans la base de données
        await foyerModel.updateOne(
            { _id: req.session.foyer._id }, // Recherche le foyer par ID
            { $push: { pieces: newPiece._id } } // Ajoute le produit à la liste des courses du foyer
        );
        res.redirect("/menage"); // Redirige vers la liste des courses
    } catch (error) {
        console.log(error);
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('pieces'); // Recherche le foyer et peuple la liste des courses en cas d'erreur
        res.render("pages/menage.twig", {
            foyer: foyerFinded,
            error: error.message, // Rend la vue "liste_courses.twig" avec un message d'erreur
        });
    }
});

module.exports = pieceRouter;