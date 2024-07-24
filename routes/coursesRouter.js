// Import des dépendances nécessaires
const authGuard = require('../middleware/authGuard'); // Middleware pour vérifier l'authentification
const coursesModel = require('../models/coursesModel'); // Modèle de données pour les courses
const bcrypt = require('bcrypt'); // Bibliothèque pour le hachage des mots de passe (non utilisé ici)
const coursesRouter = require('express').Router(); // Création d'un routeur Express
const foyerModel = require("../models/foyerModel"); // Modèle de données pour le foyer

// Route pour afficher la liste des courses
coursesRouter.get('/liste_courses', authGuard, async (req, res) => {
    try {
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('liste_Courses'); // Recherche le foyer et peuple la liste des courses
        res.render('pages/liste_courses.twig', {
            foyer: foyerFinded // Rend la vue "liste_courses.twig" avec les données du foyer
        });
    } catch (error) {
        res.status(500).send(error.message); // Renvoie une réponse d'erreur en cas d'échec
    }
});

// Route pour ajouter un nouveau produit à la liste des courses
coursesRouter.post("/liste_courses", authGuard, async (req, res) => {
    try {
        const newProduit = new coursesModel(req.body); // Crée une nouvelle instance de Produit avec les données du formulaire
        newProduit.validateSync(); // Valide les données du produit
        await newProduit.save(); // Sauvegarde le nouveau produit dans la base de données
        await foyerModel.updateOne(
            { _id: req.session.foyer._id }, // Recherche le foyer par ID
            { $push: { liste_Courses: newProduit._id } } // Ajoute le produit à la liste des courses du foyer
        );
        res.redirect("/liste_courses"); // Redirige vers la liste des courses
    } catch (error) {
        console.log(error);
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('liste_Courses'); // Recherche le foyer et peuple la liste des courses en cas d'erreur
        res.render("pages/liste_courses.twig", {
            foyer: foyerFinded,
            error: error.message, // Rend la vue "liste_courses.twig" avec un message d'erreur
        });
    }
});

// Route pour supprimer un produit de la liste des courses
coursesRouter.post("/delete_course/:id", authGuard, async (req, res) => {
    try {
        const productId = req.params.id; // Récupère l'ID du produit à supprimer
        await coursesModel.findByIdAndDelete(productId); // Supprime le produit par ID
        await foyerModel.updateOne(
            { _id: req.session.foyer._id }, // Recherche le foyer par ID
            { $pull: { liste_Courses: productId } } // Retire le produit de la liste des courses du foyer
        );
        res.redirect("/liste_courses"); // Redirige vers la liste des courses
    } catch (error) {
        console.log(error);
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('liste_Courses'); // Recherche le foyer et peuple la liste des courses en cas d'erreur
        res.render("pages/liste_courses.twig", {
            foyer: foyerFinded,
            error: error.message, // Rend la vue "liste_courses.twig" avec un message d'erreur
        });
    }
});

// Route pour valider ou invalider un produit dans la liste des courses
coursesRouter.post("/validate_course/:id", authGuard, async (req, res) => {
    try {
        const productId = req.params.id; // Récupère l'ID du produit à valider
        const product = await coursesModel.findById(productId); // Recherche le produit par ID
        product.produit_select = !product.produit_select; // Bascule la valeur booléenne de validation du produit
        await product.save(); // Sauvegarde les modifications du produit
        res.redirect("/liste_courses"); // Redirige vers la liste des courses
    } catch (error) {
        console.log(error);
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('liste_Courses'); // Recherche le foyer et peuple la liste des courses en cas d'erreur
        res.render("pages/liste_courses.twig", {
            foyer: foyerFinded,
            error: error.message, // Rend la vue "liste_courses.twig" avec un message d'erreur
        });
    }
});

// Export du routeur
module.exports = coursesRouter;