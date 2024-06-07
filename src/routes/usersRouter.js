const express = require('express')
const router = express.Router();
const passport = require('passport');


const { getAllUsers,getUsersById,createNewUser,updateUsersData,deleteuser} = require('../controllers/Users');
const authorize = require('../../src/config/security/authorization');
const authenticate = require('../../src/config/security/authenticate');

//routes

router.get('/',getAllUsers);//récupéraation de tous les utilisateurs

router.get('/admin/:id',passport.authenticate('jwt', { session: false }),getUsersById);//récupération de l'utilisateur par id en utilisant un token.

router.get('/:id',getUsersById);//récupération de l'utilisateur par id

router.post('/',createNewUser);//création d'un nouvel utilisateur

router.put('/:id',updateUsersData); //mise à jour des données de l'utilisateur

router.delete('/:id',authenticate,authorize,deleteuser);//suppression de l'utilisateur


module.exports = router;