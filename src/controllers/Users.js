const {PrismaClient} = require('@prisma/client');
const e = require('express');
const bscript = require('bcrypt');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const apiKey = "AIzaSyA8yk5QDFMq0S-pH0bi6J0wZblAwIbAznA";

require('dotenv').config

const prisma = new PrismaClient();




//getWay

async function getAllUsers(req,res){
    {
        try {
           const allUsers = await prisma.users.findMany();
           if(allUsers.length <0){
            return res.status(404).send('Not found');
           }
           res.status(200).json(allUsers);
        } catch (error) {
            console.error('Not found users in database');
            res.status(500).send({message:error.status})
        }
    }
}

async function getUsersById(req,res){
    try {
        const  {id} = req.params;
        const userById = await prisma.users.findUnique({
            where:{
                id:parseInt(id,10)//interprété comme un nombre en base 10 afin d
            }
        });

        if(!userById){
           return res.status(404).send('Not found');
        }

        res.status(200).json(userById);
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'utilisateur par ID :', error);
       return res.status(500).send('Erreur interne du serveur');
    }
}

//schema de validation des données

const emailSchema = Joi.string()
    .email({ tlds: { allow: false } })
    .not(/^</)
    .not(/\/>$/)
    .required()
    .messages({
        'string.email': "L'email doit contenir un arobase (@)",
        'string.empty': "L'email ne doit jamais être vide.",
        'string.not': "Le mot de passe ne doit jamais commencer par un chevron ouvrant et ne doit pas se terminer par un chevron fermant",

    });

//validation mot de passe

const passwordSchema = Joi.string()
    .regex(/^[A-Z][a-z0-9]+$/)
    .min(8)
    .not(/^</)
    .not(/\/>$/)
    .required()
    .messages({
        'string.min': "Le mot de passe doit contenir au moins 8 caractères",
        'string.regex': "Le mot de passe doit commencer par une lettre majuscule, contenir une lettre minuscule et un chiffre",
        'string.not': "Le mot de passe ne doit jamais commencer par un chevron ouvrant et ne doit pas se terminer par un chevron fermant",
        'string.required': "Le mot de passe ne doit jamais être vide"
    });

    const nameSchema = Joi.string()
    .not(/^</)
    .not(/\/>$/)
    .required()
    .messages({
        'string.required': "Le nom ne doit jamais être vide",
        'string.not': "Le nom ne doit jamais commencer par un chevron ouvrant et ne doit pas se terminer par un chevron fermant"
    });

const telephoneSchema = Joi.number()
    .not(/^</)
    .not(/\/>$/)
    .required()
    .messages({
        'number.required': "Le téléphone ne doit jamais être vide",
        'number.not': "Le téléphone ne doit jamais commencer par un chevron ouvrant et ne doit pas se terminer par un chevron fermant"
    });


const userSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
    nom:nameSchema,
    postNom:nameSchema,
    telephone:telephoneSchema,
    type:nameSchema
});

//async function createNewUser(req, res) {
    //const { nom, postNom, email, password, telephone, type } = req.body;
    //const { error } = await userSchema.validate({ email, password,telephone,nom,postNom,type });

   // if (error) {
       // console.error('Données non valides', error.details[0].message);
       // return res.status(400).json({ success: false, message: error.details[0].message });
    //}

    // Configuration du transporteur Nodemailer
//const transporter = nodemailer.createTransport({
 // host: 'smtp.gmail.com', 
 // port: 587,
  //auth: {
   // user: 'judahmvi@gmail.com', 
   // pass: 'kerenemvi95' 
 // }
//});

//création du token de verification du mail
// const token = uuidv4();

//     try {
//         const hashPassword = await bscript.hash(password, 10);
//         const newUser = await prisma.users.create({
//             data: {
//                 nom,
//                 postNom,
//                 email,
//                 telephone,
//                 password: hashPassword,
//                 role: type,
//                 monToken:token,
//                 verified:false
//             }
//         });

//         return res.status(201).json({ success: true, user: newUser });
//     } catch (error) {
//         console.error("Erreur lors de l'ajout d'un utilisateur:", error);
//         return res.status(500).json({ success: false, message: 'Database error' });
//     }

//      // Configuration de l'e-mail de vérification
//   const mailOptions = {
//     from: 'judahmvi@gmail.com',
//     to: email,
//     subject: 'Aidez-nous à vérifier votre compte',
//     html: `
//       <p>Bonjour ${nom},</p>
//       <p>Merci de vous être inscrit sur notre plateforme ! Veuillez cliquer sur le lien suivant pour vérifier votre adresse e-mail:</p>
//       <a href="http://localhost:3000/verify-email/${token}/${newUser.id}">Vérifier l'adresse e-mail</a>
//     `
//   };

//    // Envoi de l'e-mail de vérification
//    transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error('Erreur lors de l\'envoi de l\'e-mail de vérification:', error);
//       return res.status(500).json({ success: false, message: 'Erreur d\'envoi d\'e-mail' });
//       return;
//     }
//     console.log('Email de vérification envoyé:', info.messageId);
//   });

//   // Envoi d'une réponse JSON à l'utilisateur
//   return res.status(201).json({ success: true, message: 'Compte créé avec succès ! Veuillez vérifier votre adresse e-mail pour activer votre compte.', token });
// }


async function createNewUser(req, res) {
    const { nom, postNom, email, password, telephone, type,profilImage } = req.body;
    const { error } = await userSchema.validate({ email, password,telephone,nom,postNom,type });

    if (error) {
        console.error('Données non valides', error.details[0].message);
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
  
    const token = uuidv4();

    //Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
 host: 'Gmail', 
 port: 587,
  auth: {
   user: "judahmvi@gmail.com", 
   pass: process.env.EMAIL_PASS
 }
});


  
    try {
      // ... (User creation successful)
      const hashPassword = await bscript.hash(password, 10);
      const newUser = await prisma.users.create({
          data: {
              nom,
              postNom,
              email,
              telephone,
              password: hashPassword,
              role: type,
              monToken:token,
              verified:false,
              profilImage 
          }
      });
  
      // Sending JSON response to the user
      return res.status(201).json({ success: true, message: 'compte créer avec succés! pour activer votre compte, veillez repondre au mail.', token });
    } catch (error) {
      console.error('Erreur lors de la création de l\' utilisateur:', error);
      return res.status(500).json({ success: false, message: 'erreur de la base de donnée' });
    }
  }
  
async function verificationMail(res,req){
    const {token,id} = req.params;

    try {
        const user = await prisma.users.findUnique({
            where: {
              id: parseInt(id,10),
              token
            }
          });


  if (!user) {
    res.send('Le lien de vérification est invalide ou a expiré.');
    return;
  }
  return res.status(200).send('vérifé avec succès',user);
    } catch (error) {
        console.error('erreur lors de la vérification du mail',error);
        return res.status(500).send('internal');
    }
}
async function updateUsersData(req,res,next){
        const { email, password,telephone,nom,postNom,type } = req.body;
        const { error } = await userSchema.validate({ email, password,telephone,nom,postNom,type });
        const {id} = req.params;

        if (error) {
            console.error('Données non valides', error.details[0].message);
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        
    try {
        
        const hashPassword = await bscript.hash(password, 10);

        const findUser = await prisma.users.findUnique({where:{id:parseInt(id,10)}});
        if (!findUser) {
            return   res.status(404).send('Not found');
        }

        await prisma.users.update({
            where:{
                id:parseInt(id,10)
            },
            data:{
                nom,
                postNom,
                email,
                telephone,
                password:hashPassword,
                role:type
            }
        })

        return res.status(200).json({ success: true });
        
    } catch (error) {
        if (error !==' Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client') {
            console.error("Erreur lors de la mise à jour d'un utilisateur:", error);
        }
        
        return res.status(500).send('internal');
    }
}

async function deleteuser(req,res){
    try {
        const {id} = req.params;
        const findUserByUser = await prisma.users.findUnique({where:{id:parseInt(id,10)}});
        if (!findUserByUser) {
            return res.status(404).send('Not found');
        }
        if(findUserByUser.role=== "admin"){
            await  prisma.users.delete({where:{id:parseInt(id,10)}});
            return res.status(200).send('succès');
        }
        return res.status(200).send('permission  denied');

    } catch (error) {
        console.error("erreur lors de la suppression d\'un utilisateur", error);
        return  res.status(500).send({message:error.status});
    }
}

module.exports = {
    getAllUsers,
    getUsersById,
    createNewUser,
    updateUsersData,
    deleteuser,
    verificationMail
}
