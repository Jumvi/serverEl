const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

const { getAllUsers, getUsersById, createNewUser, updateUsersData, deleteuser } = require('../controllers/Users');
const authorize = require('../../src/config/security/authorization');
const authenticate = require('../../src/config/security/authenticate');

//routes
router.get('/', getAllUsers); // Récupération de tous les utilisateurs
router.get('/admin/:id', passport.authenticate('jwt', { session: false }), getUsersById); // Récupération de l'utilisateur par id avec token
router.get('/:id', getUsersById); // Récupération de l'utilisateur par id
router.post('/', upload.single('profilImage'), createNewUser); // Création d'un nouvel utilisateur
router.put('/:email',upload.single('profilImage'), updateUsersData); // Mise à jour des données de l'utilisateur
router.delete('/:id', deleteuser); // Suppression de l'utilisateur

module.exports = router;
