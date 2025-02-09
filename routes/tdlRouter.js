// Import des dépendances nécessaires
const authGuard = require('../middleware/authGuard'); // Middleware pour vérifier l'authentification
const tdlModel = require("../models/tdlModel"); // Modèle de données pour la to do list
const bcrypt = require('bcrypt'); // Bibliothèque pour le hachage des mots de passe (non utilisé ici)
const tdlRouter = require('express').Router(); // Création d'un routeur Express
const foyerModel = require("../models/foyerModel"); // Modèle de données pour le foyer

// Route pour afficher la liste des courses
tdlRouter.get('/tdl', authGuard, async (req, res) => {
    try {
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('tdl');
        res.render('pages/tdl.twig', {
            foyer: foyerFinded // Passe les données du foyer à la vue
        });
    } catch (error) {
        res.status(500).send(error.message); // Renvoie une réponse d'erreur en cas d'échec
    }
});

tdlRouter.post("/tdl", authGuard, async (req, res) => {
    try {
        const newTache = new tdlModel(req.body); // Crée une nouvelle instance da tache avec les données du formulaire
        newTache.validateSync(); // Valide les données du produit
        await newTache.save(); // Sauvegarde le nouveau produit dans la base de données
        await foyerModel.updateOne(
            { _id: req.session.foyer._id }, // Recherche le foyer par ID
            { $push: { tdl: newTache._id } } // Ajoute la tache à la liste des courses du foyer
        );
        res.redirect("/tdl"); // Redirige vers la liste des courses
    } catch (error) {
        console.log(error);
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('tdl'); // Recherche le foyer et peuple la liste des courses en cas d'erreur
        res.render("pages/tdl.twig", {
            foyer: foyerFinded,
            error: error.message, // Rend la vue "liste_courses.twig" avec un message d'erreur
        });
    }
});

// Route pour supprimer une tache de la To Do List
tdlRouter.post("/delete_tache/:id", authGuard, async (req, res) => {
    try {
        const tacheId = req.params.id; // Récupère l'ID de la tache à supprimer
        await tdlModel.findByIdAndDelete(tacheId); // Supprime la tache par ID
        await foyerModel.updateOne(
            { _id: req.session.foyer._id }, // Recherche le foyer par ID
            { $pull: { tdl: tacheId } } // Retire la tache de la to do list du foyer
        );
        res.redirect("/tdl"); // Redirige vers la to do list
    } catch (error) {
        console.log(error);
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('tdl'); // Recherche le foyer et peuple la to do lsit en cas d'erreur
        res.render("pages/tdl.twig", {
            foyer: foyerFinded,
            error: error.message, // Rend la vue "tdl.twig" avec un message d'erreur
        });
    }
});

module.exports = tdlRouter;