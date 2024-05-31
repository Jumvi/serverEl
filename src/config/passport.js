const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();


const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //permet d'extraire les token dans l'entête de la requête
    secretOrKey: process.env.JWT_SECRET // votre clé secrète pour signer les tokens
  };

  //middleware passport pour la definition de la strategie

  passport.use(new 
    JwtStrategy(options,async(payload,done)=>{
        try {
            const findUser = await prisma.users.findUnique({
                where:{
                    id:payload.id
                }
            }) 

            if (!findUser) {
                return done(null,false)
            }
            return done(null,findUser);
        } catch (error) {
            done(error,false);   
        }
    })
  )

  module.exports = passport;