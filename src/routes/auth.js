const express = require('express');
const router = express.Router();
const Joi = require('joi');

const {getLogin,verifyOtp} = require('../controllers/auth');


router.post('/',getLogin);
router.post('/verify-acount',verifyOtp);


module.exports = router;

