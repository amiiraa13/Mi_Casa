// Import des dépendances nécessaires
const membreRouter = require("express").Router(); // Création d'un routeur Express
const membreModel = require("../models/membreModel"); // Modèle de données pour les membres
const authGuard = require("../middleware/authGuard"); // Middleware pour vérifier l'authentification
const foyerModel = require("../models/foyerModel"); // Modèle de données pour le foyer

// Route pour afficher la page du foyer avec les membres
membreRouter.get("/foyer", authGuard, async (req, res) => {
    try {
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate({
            path:'membres',
            populate:{
                path:'tache'
            }
        }); // Recherche le foyer et peuple les membres
        
        res.render("pages/foyer.twig", {
            foyer: foyerFinded ,// Rend la vue "foyer.twig" avec les données du foyer
            membres: foyerFinded.membres,

        });
    } catch (error) {
        res.status(500).send(error.message); // Renvoie une réponse d'erreur en cas d'échec
    }
});

// Route pour ajouter un nouveau membre au foyer
membreRouter.post("/foyer", authGuard, async (req, res) => {
    try {
        const newMembre = new membreModel(req.body); // Crée une nouvelle instance de Membre avec les données du formulaire
        newMembre.validateSync(); // Valide les données du membre
        await newMembre.save(); // Sauvegarde le nouveau membre dans la base de données
        await foyerModel.updateOne(
            { _id: req.session.foyer._id }, // Recherche le foyer par ID
            { $push: { membres: newMembre._id } } // Ajoute le membre à la liste des membres du foyer
        );
        res.redirect("/foyer"); // Redirige vers la page du foyer
    } catch (error) {
        console.log(error);
        res.render("pages/foyer.twig", {
            foyer: req.session.foyer, // Rend la vue "foyer.twig" avec les données du foyer
            error: error.message, // Affiche un message d'erreur
        });
    }
});

// Route pour supprimer un membre du foyer
membreRouter.get("/membredelete/:membreid", authGuard, async (req, res) => {
    try {
        await membreModel.deleteOne({ _id: req.params.membreid }); // Supprime le membre par ID
        await foyerModel.updateOne(
            { _id: req.session.foyer._id }, // Recherche le foyer par ID
            { $pull: { membres: req.params.membreid } } // Retire le membre de la liste des membres du foyer
        );
        res.redirect("/foyer"); // Redirige vers la page du foyer
    } catch (error) {
        
        res.render("pages/foyer.twig", {
            errorMessage: "Un probleme est survenu pendant la suppression", // Affiche un message d'erreur
            foyer: await foyerModel.findById(req.session.foyer._id).populate("membres"), // Recherche le foyer et peuple les membres
            title: "foyer - membrestore", // Titre de la page
        });
    }
});

// Route pour afficher la page de mise à jour d'un membre
membreRouter.get("/membreupdate/:membreid", authGuard, async (req, res) => {
    try {
        let membre = await membreModel.findById(req.params.membreid); // Recherche le membre par ID
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('membres'); // Recherche le foyer et peuple les membres
        
        res.render("pages/foyer.twig", {
            title: "foyer - membrestore", // Titre de la page
            foyer: foyerFinded, // Foyer trouvé avec les membres
            wanted: membre, // Membre à mettre à jour
            membres: foyerFinded.membres, // Liste des membres
        });
    } catch (error) {
        res.render("pages/foyer.twig", {
            errorMessage: "Le membre que vous souhaitez modifier n'existe pas", // Affiche un message d'erreur
            foyer: await foyerModel.findById(req.session.foyer._id), // Recherche le foyer par ID
            title: "foyer - membrestore", // Titre de la page
        });
    }
});

// Route pour mettre à jour les informations d'un membre
membreRouter.post("/membreupdate/:membreid", authGuard, async (req, res) => {
    try {
        await membreModel.updateOne({ _id: req.params.membreid }, req.body); // Met à jour le membre par ID avec les données du formulaire
        res.redirect("/foyer"); // Redirige vers la page du foyer
    } catch (error) {
        res.render("pages/foyer.twig", {
            title: "Modifier un membre - membrestore", // Titre de la page
            foyer: await foyerModel.findById(req.session.foyer._id), // Recherche le foyer par ID
            membre: await membreModel.findById(req.params.membreid), // Recherche le membre par ID
            error: error.message, // Affiche un message d'erreur
        });
    }
});

// Export du routeur
module.exports = membreRouter;