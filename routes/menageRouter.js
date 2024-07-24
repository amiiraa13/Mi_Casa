const authGuard = require('../middleware/authGuard'); 
const bcrypt = require('bcrypt'); 
const menageRouter = require('express').Router(); 
const foyerModel = require("../models/foyerModel");



menageRouter.get('/liste_courses', authGuard, async (req, res) => {
    try {
        const foyerFinded = await foyerModel.findById(req.session.foyer._id).populate('liste_Courses'); // Recherche le foyer et peuple la liste des courses
        res.render('pages/liste_courses.twig', {
            foyer: foyerFinded // Rend la vue "liste_courses.twig" avec les données du foyer
        });
    } catch (error) {
        res.status(500).send(error.message); // Renvoie une réponse d'erreur en cas d'échec
    }
});


module.exports = menageRouter;