const express = require('express');
const router = express.Router();
const  {getContribution, getContributionById,createNewContribution,deleteContribution} = require('../controllers/Contributions');
const authorize = require('../../src/config/security/authorization');
const authenticate = require('../../src/config/security/authenticate');
const passport = require('../config/passport');

//endPoints

router.get('/',getContribution);

router.get('/:id',getContributionById);

router.get('/users/:id',passport.authenticate('jwt', { session: false }),getContributionById);

router.post('/',createNewContribution);

router.delete('/:id',passport.authenticate('jwt', { session: false }),authorize,deleteContribution);

module.exports = router;