// Importation des modules nécessaires
const express = require('express'); // Importation d'Express
const pieceRouter = express.Router(); // Création d'un routeur d'Express
const foyerModel = require('../models/foyerModel'); // Importation du modèle 'foyerModel'
const pieceModel = require('../models/pieceModel'); // Importation du modèle 'pieceModel'
const menageModel = require('../models/menageModel'); // Importation du modèle 'menageModel'
const authGuard = require('../middleware/authGuard'); // Importation du middleware d'authentification
const membreModel = require('../models/membreModel');

// Route GET pour afficher les informations du foyer et des ménages
pieceRouter.get('/menage', authGuard, async (req, res) => {
    try {
        // Recherche du foyer par ID avec les pièces et les ménages associés
        const foyerFinded = await foyerModel.findById(req.session.foyer._id)
            .populate({

                path: 'pieces',
                populate: {
                    path: 'menages',
                    model: 'menages'
                }
            })
            .populate({
                path: "membres"
            })
            
        // Rendu du template 'menage.twig' avec les données du foyer trouvé
        res.render('pages/menage.twig', {
            foyer: foyerFinded,
            membres: foyerFinded.membres
        });
    } catch (error) {
        // En cas d'erreur, renvoie une réponse avec le statut 500 et le message d'erreur
        res.status(500).send(error.message);
    }
});

// Route POST pour ajouter une nouvelle pièce
pieceRouter.post('/piece', authGuard, async (req, res) => {
    try {
        // Création d'une nouvelle pièce avec les données du corps de la requête
        const newPiece = new pieceModel(req.body);
        // Validation des données de la pièce
        newPiece.validateSync();
        // Sauvegarde de la nouvelle pièce dans la base de données
        await newPiece.save();
        // Mise à jour du foyer pour ajouter l'ID de la nouvelle pièce
        await foyerModel.updateOne(
            { _id: req.session.foyer._id },
            { $push: { pieces: newPiece._id } }
        );
        // Redirection vers la page '/menage'
        res.redirect('/menage');
    } catch (error) {
        console.log(error);
        // Recherche du foyer en cas d'erreur pour réafficher la page avec le message d'erreur
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('pieces');
        res.render('pages/menage.twig', {
            foyer: foyerFinded,
            error: error.message,
        });
    }
});

// Route POST pour ajouter un ménage à une pièce spécifique
pieceRouter.post('/piece/:pieceid/menage', authGuard, async (req, res) => {
    try {
        // Création d'un nouveau ménage avec les données du corps de la requête
        const newMenage = new menageModel(req.body);
        // Validation des données du ménage
        newMenage.validateSync();
        // Sauvegarde du nouveau ménage dans la base de données
        await newMenage.save();
        // Mise à jour de la pièce pour ajouter l'ID du nouveau ménage
        await pieceModel.updateOne(
            { _id: req.params.pieceid },
            { $push: { menages: newMenage._id } }
        );
        await membreModel.updateOne(
            { _id: req.body.membres },
            { $push: { tache: newMenage._id } }
        );

        // Redirection vers la page '/menage'
        res.redirect('/menage');
    } catch (error) {
        // Recherche du foyer en cas d'erreur pour réafficher la page avec le message d'erreur
        const foyerFinded = await foyerModel.findById(req.session.foyer._id)
            .populate({
                path: 'pieces',
                populate: {
                    path: 'menages',
                    model: 'menages'
                }
            });
        res.render('pages/menage.twig', {
            foyer: foyerFinded,
            error: error.message,
        });
    }
});

// Route GET pour supprimer une pièce spécifique
pieceRouter.get('/piecedelete/:pieceid', authGuard, async (req, res) => {
    try {
        // Suppression de la pièce par ID
        await pieceModel.deleteOne({ _id: req.params.pieceid });
        // Mise à jour du foyer pour retirer l'ID de la pièce supprimée
        await foyerModel.updateOne(
            { _id: req.session.foyer._id },
            { $pull: { pieces: req.params.pieceid } }
        );
        // Redirection vers la page '/menage'
        res.redirect('/menage');
    } catch (error) {
        console.log(error.message);
        // Recherche du foyer en cas d'erreur pour réafficher la page avec le message d'erreur
        const foyerFinded = await foyerModel.findById(req.session.foyer._id)
            .populate({
                path: 'pieces',
                populate: {
                    path: 'menages',
                    model: 'menages'
                }
            });
        res.render('pages/menage.twig', {
            errorMessage: "Un problème est survenu pendant la suppression",
            foyer: foyerFinded,
            title: "menage - piecestore",
        });
    }
});

// Route GET pour afficher le formulaire de mise à jour d'une pièce spécifique
pieceRouter.get('/pieceupdate/:pieceid', authGuard, async (req, res) => {
    try {
        // Recherche de la pièce par ID avec les ménages associés
        let piece = await pieceModel.findById(req.params.pieceid).populate('menages');
        // Recherche du foyer pour obtenir toutes les pièces
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('pieces');
        // Rendu du template 'menage.twig' avec les données du foyer et de la pièce trouvée
        res.render('pages/menage.twig', {
            title: "foyer - menagetore",
            foyer: foyerFinded,
            wanted: piece,
            error: null,
        });
    } catch (error) {
        // Recherche du foyer en cas d'erreur pour réafficher la page avec le message d'erreur
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('pieces');
        res.render('pages/menage.twig', {
            errorMessage: "La pièce que vous souhaitez modifier n'existe pas",
            foyer: foyerFinded,
            title: "foyer - menagestore",
        });
    }
});

// Route POST pour mettre à jour une pièce spécifique
pieceRouter.post('/pieceupdate/:pieceid', authGuard, async (req, res) => {
    try {
        // Mise à jour de la pièce par ID avec les nouvelles données
        await pieceModel.updateOne({ _id: req.params.pieceid }, req.body);
        // Redirection vers la page '/menage'
        res.redirect('/menage');
    } catch (error) {
        // Recherche du foyer et de la pièce en cas d'erreur pour réafficher la page avec le message d'erreur
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('pieces');
        const wanted = await pieceModel.findById(req.params.pieceid).populate('menages');
        res.render('pages/menage.twig', {
            title: "Modifier une pièce - piecestore",
            foyer: foyerFinded,
            wanted: wanted,
            error: error.message,
        });
    }
});

// Route GET pour obtenir tous les ménages d'une pièce spécifique
pieceRouter.get('/piece/:pieceid/menages', authGuard, async (req, res) => {
    try {
        // Recherche de la pièce par ID avec les ménages associés
        const piece = await pieceModel.findById(req.params.pieceid).populate({
            path: "menages",
            populate: {
                path: 'membres',
                
            }
        });
        
        // Renvoie des ménages sous forme de JSON
        res.json({ menages: piece.menages });
    } catch (error) {
        // En cas d'erreur, renvoie une réponse avec le statut 500 et le message d'erreur
        res.status(500).send(error.message);
    }
});

// Route DELETE pour supprimer un ménage d'une pièce spécifique
pieceRouter.get('/deletepiece/:pieceid/menagedelete/:menageid', authGuard, async (req, res) => {
    try {
        // Suppression du ménage par ID
        await menageModel.deleteOne({ _id: req.params.menageid });
        console.log('blaa');
        // Mise à jour de la pièce pour retirer l'ID du ménage supprimé
        await pieceModel.updateOne(
            { _id: req.params.pieceid },
            { $pull: { menages: req.params.menageid } }
        );
        
        // Redirection vers la page '/menage'
        res.redirect('/menage');
    } catch (error) {
        // En cas d'erreur, affiche un message d'erreur et recharge la page avec les données du foyer
        const foyerFinded = await foyerModel.findById(req.session.foyer._id)
            .populate({
                path: 'pieces',
                populate: {
                    path: 'menages',
                    model: 'menages'
                }
            });
        res.render('pages/menage.twig', {
            errorMessage: "Un problème est survenu pendant la suppression du ménage",
            foyer: foyerFinded,
            title: "menage - piecestore",
        });
    }
});

// Exportation du routeur pour utilisation dans d'autres parties de l'application
module.exports = pieceRouter;