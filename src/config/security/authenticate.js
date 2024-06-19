const jwt = require('jsonwebtoken');

require('dotenv').config;


const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ message: 'Accès refusé, aucun token.' });
    }

    try {
        
        
        const tokenWithoutBearer = token.replace('Bearer ', '');
        
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        if (!decoded) {
          console.log('no');
        }
        req.user = decoded;
        return next();
    } catch (ex) {
      console.error(ex);
        return res.status(400).send({ message: 'Token invalide.' });

    }
};

module.exports = authenticate;
