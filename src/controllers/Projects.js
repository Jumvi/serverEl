const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');

const prisma = new PrismaClient();

//schema de validation des données



//validation mot de passe



    const nameSchema = Joi.string()
    .not(/^</)
    .not(/\/>$/)
    .required()
    .messages({
        'string.required': "Le nom ne doit jamais être vide",
        'string.not': "Le nom ne doit jamais commencer par un chevron ouvrant et ne doit pas se terminer par un chevron fermant"
    });

const userSchema = Joi.object({
    titre: nameSchema,
    description: nameSchema,
    duree:nameSchema,
    categorie:nameSchema,
    image:nameSchema,
    pdfProjet:nameSchema,
    localisation:nameSchema
    
});


async function getAllProjects(req, res) {
  try {
    const allProjects = await prisma.project.findMany();
    res.status(200).json(allProjects); 
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les projets:', error);
    res.status(500).send('Erreur serveur');
  }
}

async function getProjectById(req,res){
  try {
    const {id} = req.params;
    const findProjectById = await prisma.project.findUnique({
      where:{
        id:id
      }
    });

    if (!findProjectById) {
      res.status(404).send('Not found');
    } else {
      res.status(200).json(findProjectById);
    }
  } catch (error) {
    console.error('Not found projecct:',error);
    res.status(500).send({message:error.status});
  }
}

async function getProjectByName(req, res) {
  try {
    const { titre } = req.params;
    const findProjectByName = await prisma.project.findFirst({
      where: {
        titre: titre
      }
    }); 

    if (!findProjectByName) {
      return res.status(404).send('Projet non trouvé');
    }

    res.status(200).json(findProjectByName);
  } catch (error) {
    console.error('Erreur lors de la récupération du projet par titre:', error);
    res.status(500).send('Erreur serveur');
  }
}



async function getProjectsByUsers(req, res) {
  try {
    const { userId } = req.params; 
    const findUsersProjects = await prisma.project.findMany({
      where: {
        userId: parseInt(userId)
      }
    });

    if (!findUsersProjects.length) { 
      res.status(404).send('Non trouvable');
      console.log('Erreur lors de la récupération des projets de l\'utilisateur');
    } else {
      res.status(200).json(findUsersProjects);
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des projets de l\'utilisateur:', error);
    res.status(500).send('Erreur serveur');
  }
}

async function createNewProject(req, res) {
  const { titre, description,duree,localisation,categorie,image,pdfProjet, userId } = req.body; 
  const { error } = await userSchema.validate({ titre, description,duree,localisation,categorie,image,pdfProjet });

  if (error) {
    console.error('Données non valides', error.details[0].message);
    return res.status(400).json({ success: false, message: error.details[0].message });
}

  try {
    const findUserByUserId = await prisma.project.findUnique({
      where:{
        id:userId
      }
    });

    if(!findUserByUserId){
      res.status(404).send('Not found')
    }
    await prisma.project.create({
      data: {
        titre,
        description,
        duree,
        localisation,
        categorie,
        image,
        pdfProjet,
        user:{
          connect:{
            id:userId
          }
        }
      }
    });

    res.status(201).json({success:true});

  } catch (error) {
    console.error('Erreur lors de la création:', error);
    res.status(500).send({message:error.status});
  }
}

async function updateProject(req, res) {
  try {
    const { data } = req.body;
    const { id } = req.params;
    const findProject = await prisma.project.findUnique({
      where: {
        id: parseInt(id,10) 
      }
    });

    if (!findProject) {
      res.status(404).send('Projet introuvable');
      return;
    }

    if (data.titre || data.description || data.userId) {
      await prisma.project.update({
        where: { id: parseInt(id,10) }, 
        data: {
          titre: data.titre,
          description: data.description,
          userId: data.userId
        }
      });
      res.status(200).send('Mise à jour réussie');
    } else {
      res.status(400).send('Aucune donnée à mettre à jour');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).send('Erreur serveur');
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    const findProject = await prisma.project.findUnique({
      where: {
        id: parseInt(id,10) 
      }
    });

    if (!findProject) {
      res.status(404).send('Projet introuvable');
      return;
    }

    await prisma.project.delete({
      where: {
        id: parseInt(id,10) 
      }
    });

    res.status(200).send('Suppression réussie');
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).send('Erreur serveur');
  }
}

module.exports = {
  getAllProjects,
  getProjectsByUsers,
  createNewProject,
  updateProject,
  deleteProject,
  getProjectById,
  getProjectByName
};