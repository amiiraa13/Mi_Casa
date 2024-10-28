// Import des dépendances nécessaires
const authGuard = require('../middleware/authGuard') // Middleware pour vérifier l'authentification
const foyerModel = require('../models/foyerModel') // Modèle de données pour Foyer
const bcrypt = require('bcrypt') // Bibliothèque pour le hachage des mots de passe
const foyerRouter = require('express').Router() // Création d'un routeur Express

// Route pour afficher la page de connexion
foyerRouter.get('/signin', (req,res)=>{
    res.render("pages/signin.twig") // Rend la vue "signin.twig"
})

// Route pour gérer la soumission du formulaire d'inscription
foyerRouter.post('/signin', async(req,res)=>{
    try {
        let newFoyer = new foyerModel(req.body) // Crée une nouvelle instance de Foyer avec les données du formulaire
        newFoyer.validateSync() // Valide les données
        await newFoyer.save() // Sauvegarde le nouveau foyer dans la base de données
        res.redirect('/login') // Redirige vers la page de connexion
    } catch (error) {
        res.render("pages/signin.twig", {
            error: error.message // Rend la vue "signin.twig" avec un message d'erreur
        })
    }
})

// Route pour afficher la page de connexion
foyerRouter.get('/login', (req,res)=>{
    res.render('pages/login.twig') // Rend la vue "login.twig"
})

// Route pour gérer la soumission du formulaire de connexion
foyerRouter.post('/login',  async (req,res)=>{
    try {
        const foyer = await foyerModel.findOne({name: req.body.name}) // Recherche un foyer par nom
        if (foyer) { // Si le foyer est trouvé
            if (foyer && bcrypt.compareSync(req.body.password, foyer.password)) { // Compare les mots de passe
                req.session.foyer = foyer // Stocke le foyer dans la session
                res.redirect("/dashboard") // Redirige vers le tableau de bord
            } else {
                throw new Error("les mot de passe ne correspondent pas") // Lance une erreur si les mots de passe ne correspondent pas
            }
        } else {
            throw new Error("utilisateur pas enregistrer") // Lance une erreur si l'utilisateur n'est pas enregistré
        }
    } catch (error) {
        res.render('pages/login.twig', {
            error: error.message // Rend la vue "login.twig" avec un message d'erreur
        })
    }
})

// Route pour afficher le tableau de bord
foyerRouter.get('/dashboard', authGuard, async(req,res)=>{
   
    res.render('pages/dashboard.twig',{
        foyer: req.session.foyer // Rend la vue "dashboard.twig" avec les données du foyer
    })
})

// Route pour afficher les membres du foyer
foyerRouter.get('/foyer', authGuard, async (req, res) => {
    let query = {}; // Initialisation de la requête vide
    if (req.query.query) { // Si une requête de recherche est présente
        query[req.query.searchType] = { $regex: new RegExp(req.query.query, 'i') }; // Ajoute un filtre de recherche
    }
    try {
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate({
            path: "membres",
            match: query,
            populate:{
                path: "tache",
            }

        }); // Recherche le foyer par ID et récupère les membres correspondant au filtre
        res.render('pages/foyer.twig', {
            foyer: req.session.foyer, // Rend la vue "foyer.twig" avec les données du foyer et ses membres
            membres: foyerFinded.membres
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message); // Renvoie une réponse d'erreur en cas d'échec
    }
});

// Route pour gérer la déconnexion
foyerRouter.get('/logout', (req,res)=>{
    req.session.destroy() // Détruit la session
    res.redirect('/login') // Redirige vers la page de connexion
})

// Route pour supprimer un foyer par ID
foyerRouter.get("/foyerdelete/:foyerid", authGuard, async (req, res) => {
    try {
        await foyerModel.deleteOne({ _id: req.params.foyerid }); // Supprime le foyer par ID
        req.session.destroy() // Détruit la session
        res.redirect("/signin"); // Redirige vers la page d'inscription
    } catch (error) {
        console.log(error.message);
        res.render("pages/login.twig", {
            errorMessage: "Un probleme est survenu pendant la suppression", // Rend la vue "login.twig" avec un message d'erreur
        });
    }
});


// Export du routeur
module.exports = foyerRouter





