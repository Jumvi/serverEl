const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const dotenv = require('dotenv');
const PORT = process.env.PORT||3000;
const cors = require('cors');


const projectRouter = require('./src/routes/projectRouter');
const userRouter = require('./src/routes/usersRouter');
const loginRouter = require('./src/routes/auth');
const contributionRouter=require('./src/routes/contribution');

dotenv.config()

//middleware

server.use(express.json());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use(cors({
    origin: 'http://localhost:5173', // Le domaine de l'application frontend permettant ainsi l'autorisation de ses methodes http vers le server-client
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

server.use(helmet()); //ajout de la sécurité sur l'entête ainsi que l'ajout des quelques fonctionnalités de sécurité

server.use('/projects',projectRouter);  //middleware qui permet à l'utilisateur de pouvoir se connecté aux endPoints par le chemin projects
server.use('/users',userRouter); //middleware pour la connexion du client au user
server.use('/login',loginRouter); //middleware pour le login
server.use('/contribution',contributionRouter); //middleware pour la contribution


server.listen(PORT,()=>{
    console.log('server running on port:',PORT);
})