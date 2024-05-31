const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

async function authorize(req,res,next){
  const {id}=req.params;
  try {
    const findUser = await prisma.users.findUnique({where:{id:parseInt(id,10)}});
    if(!findUser){
      return res.status(400).send('not found');
    }

    if(findUser.role !== 'admin'){
      next()
    }
    return res.status(403).send('permission denied');
  } catch (error) {
    console.log('erreur lors de l\'autorisation de l\'utilisateur:',error);
    return res.status(500).send('erreur');
  }
}

module.exports = authorize;