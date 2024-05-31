const express = require('express');
const router = express.Router();
const { getAllProjects,getProjectsByUsers,getProjectById,getProjectByName,createNewProject,updateProject,deleteProject} = require('../controllers/Projects');
const authorize = require('../../src/config/security/authorization');
const authenticate = require('../../src/config/security/authenticate');
const passport = require('passport');

//différentes routes

router.get('/', getAllProjects);

router.get('/:id', getProjectById);

router.get('/myprojects/:id',passport.authenticate('jwt', { session: false }),getProjectById)

router.post('/', createNewProject);

router.put('/:id',passport.authenticate('jwt', { session: false }),authorize, updateProject);

router.delete('/:id',passport.authenticate('jwt', { session: false }),authorize, deleteProject);

module.exports = router;