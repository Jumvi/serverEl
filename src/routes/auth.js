const express = require('express');
const router = express.Router();
const Joi = require('joi');

<<<<<<< HEAD
const {getLogin,verifyOtp,forgotpassword,resetPassword} = require('../controllers/auth');



router.post('/',getLogin);
router.post('/verify-acount',verifyOtp);
router.post('/forgot-password',forgotpassword);
router.post('/reset-password',resetPassword);



module.exports = router;

