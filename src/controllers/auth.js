const passport = require('passport');
const express = require('express');
const app = express();
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const otpGenerator = require('otp-generator');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
require('dotenv').config();


app.use(express.json());

const path = require('../../serverelanga-firebase-adminsdk-7j0ub-ae6ae15045.json');
const prisma = new PrismaClient();

admin.initializeApp({
    credential: admin.credential.cert(path),
});

const emailSchema = Joi.string()
    .email({ tlds: { allow: false } })
    .pattern(/^[^<].*[^>]$/)
    .required()
    .messages({
        'string.email': "L'email doit contenir un arobase (@)",
        'string.empty': "L'email ne doit jamais être vide.",
        'string.pattern.base': "L'email ne doit pas contenir de chevrons ouvrants ou fermants",
    });

const passwordSchema = Joi.string()
    .pattern(/^[A-Z][a-z0-9]+$/)
    .min(8)
    .pattern(/^[^<].*[^>]$/)
    .required()
    .messages({
        'string.min': "Le mot de passe doit contenir au moins 8 caractères",
        'string.pattern.base': "Le mot de passe doit commencer par une lettre majuscule, contenir une lettre minuscule et un chiffre et ne pas contenir de chevrons ouvrants ou fermants",
        'string.required': "Le mot de passe ne doit jamais être vide"
    });

const userSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema
});

// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function getLogin(req, res) {
    const { email, password } = req.body;
    const { error } = await userSchema.validate({ email, password });

    if (error) {
        console.error('Données non valides', error.details[0].message);
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Email non reconnu, veuillez vous enregistrer' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(403).json({ success: false, message: 'Mot de passe incorrect, veuillez réessayer' });
        }

        const otpCode = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false
        });

        await sendOTPToUser(user, otpCode);

        return res.status(200).json({ success: true, message: 'OTP envoyé. Veuillez vérifier votre email' });

    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return res.status(500).json({ success: false, message: 'Erreur de base de données' });
    }
}

async function sendOTPToUser(user, otp) {
    const email = user.email;
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Votre code OTP',
            text: `Votre code OTP est ${otp}`,
        });
        await prisma.users.update({
            where:{
                email:email
            },
            data:{
                otpSecret:otp
            }
        })
        console.log('Code OTP envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi du code OTP :', error);
        throw new Error('Erreur lors de l\'envoi du code OTP');
    }
}

async function verifyOtp (req,res){
    const { email, otpSecret } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { email: email }
        });

        if (!user || user.otpSecret !== otpSecret) {
            return res.status(403).json({ success: false, message: 'OTP incorrect, veuillez réessayer' });
        }

        await prisma.users.update({
            where: { email: email },
            data: { otpSecret: null }
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ success: true, token: token });
    } catch (error) {
        console.error("Erreur lors de la vérification de l'OTP:", error);
        res.status(500).json({ success: false, message: 'Erreur de base de données' });
    }
}


module.exports = { getLogin,verifyOtp };
