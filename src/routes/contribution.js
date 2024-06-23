const express = require('express');
const router = express.Router();
const  {getContribution, getContributionById,createNewContribution,deleteContribution} = require('../controllers/Contributions');
const authorize = require('../../src/config/security/authorization');
const authenticate = require('../../src/config/security/authenticate');
const passport = require('../config/passport');
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

//endPoints

router.get('/',getContribution);

router.get('/:id',getContributionById);

router.get('/users/:id',passport.authenticate('jwt', { session: false }),getContributionById);

router.post('/', upload.single('releverBancaire'),createNewContribution);

router.delete('/:id',passport.authenticate('jwt', { session: false }),authorize,deleteContribution);

module.exports = router;