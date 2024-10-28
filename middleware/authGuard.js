// Importation du modèle de données pour le foyer
const foyerModel = require('../models/foyerModel');

// Middleware pour vérifier l'authentification des utilisateurs
const authGuard = async (req, res, next) => {
    try {
        // Vérifie si la session contient des informations sur le foyer
        if (req.session.foyer) {
            
            // Recherche le foyer dans la base de données à partir de l'ID stocké dans la session
            const foyerFinded = await foyerModel.findOne({ _id: req.session.foyer._id });
            
            // Si le foyer est trouvé, passe au middleware suivant
            if (foyerFinded) {
                next();
            } else {
                console.log('Foyer non trouvé');
                // Si le foyer n'est pas trouvé, redirige vers la page de connexion
                res.redirect('/login');
            }
        } else {
            // Si la session ne contient pas d'informations sur le foyer, redirige vers la page de connexion
            res.redirect('/login');
        }
    } catch (error) {
        // En cas d'erreur, envoie un message d'erreur comme réponse
        res.send(error.message);
    }
};

// Exportation du middleware pour l'utiliser dans d'autres parties de l'application
module.exports = authGuard;







