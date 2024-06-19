const express = require('express');
const router = express.Router();
const { getAllProjects,getProjectByCategory,getProjectById,getProjectByName,createNewProject,updateProject,deleteProject} = require('../controllers/Projects');
const authorize = require('../../src/config/security/authorization');
const authenticate = require('../../src/config/security/authenticate');
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

//différentes routes

router.get('/', getAllProjects);

router.get('/:id', getProjectById);

router.get('/categorie/:categorie',getProjectByCategory);


router.get('/myprojects/:id',passport.authenticate('jwt', { session: false }),getProjectById)

router.post('/', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdfProjet', maxCount: 1 },
    {name:'risque',maxCount:1}
  ]), createNewProject);

router.put('/:id',passport.authenticate('jwt', { session: false }),authorize, updateProject);

router.delete('/:id',passport.authenticate('jwt', { session: false }),authorize, deleteProject);

module.exports = router;