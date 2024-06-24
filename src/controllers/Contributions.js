const {PrismaClient} = require('@prisma/client');
const Joi = require('joi');


const prisma = new PrismaClient();

const nameSchema = Joi.string()
    .not(/^</)
    .not(/\/>$/)
    .required()
    .messages({
        'string.required': "Le nom ne doit jamais être vide",
        'string.not': "Le nom ne doit jamais commencer par un chevron ouvrant et ne doit pas se terminer par un chevron fermant"
    });

    const montantSchema = Joi.number()
    .not(/^</)
    .not(/\/>$/)
    .required()
    .messages({
        'number.required': "Le nom ne doit jamais être vide",
        'number.not': "Le nom ne doit jamais commencer par un chevron ouvrant et ne doit pas se terminer par un chevron fermant"
    });

    const projectSchema = Joi.object({
        echeancePaiement: nameSchema,
        conditionRemboursement:nameSchema,
        typeInvestissement:nameSchema
        
    });

async function getContribution(req,res){
    try {
        const contribution = await prisma.contribution.findMany();
        if(!contribution){
            res.status(404).send('Not found any');
        }
        res.status(200).json({success:true,contribution});
    } catch (error) {
        console.error('erreur lors de la récupération des contributions');
        res.status(500).json({success:false,error});
    }
}

async function getContributionById(req,res){
    const {id} = req.params;
    try {
        const findContributionById = await prisma.contribution.findUnique({where:{id:parseInt(id,10)}});

    if(!findContributionById){
            res.status(404).send('Not found ');
        }
        res.status(200).json({success:true,findContributionById});
    } catch (error) {
        console.error('erreur lors de la récupération de la contributions');
        res.status(500).json({success:false,error});
    }
}

async function createNewContribution(req,res){
    const {montant,titre,echeancePaiement,conditionRemboursement,typeInvestissement,userId}=req.body;
     const releverBancaire = req.file ? req.file.path : null;
    const {error}= await projectSchema.validate({echeancePaiement,conditionRemboursement,typeInvestissement});
    if (error) {
        console.error('Données non valides', error.details[0].message);
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    try {
        const findProject = await prisma.project.findFirst({where:{titre:titre}});
        if (!findProject) {
            res.status(404).send({message:"not found"})
        } 

        findProject.totalRecu = parseInt(findProject.totalRecu) + parseInt(montant);
        await prisma.project.update({where:{
            id:findProject.id,
           
        },
        data:{
            totalRecu:findProject.totalRecu
        }
    })
        const newContribution = await prisma.contribution.create({
            data:{
                montant:parseInt(montant),
                echeancePaiement,
                conditionRemboursement,
                releverBancaire:releverBancaire,
                typeInvestissement,
                user:{
                    connect:{
                        id:parseInt(userId,10)
                    }
                },
                project:{
                    connect:{
                        id:findProject.id
                    }
                }
            }
        });
        res.status(201).json({success:true,newContribution, titre:findProject.titre});
    } catch (error) {
        console.error("erreur lors de la création d\'une contribution:",error);
        res.status(500).send({message:error.status});
    }
}

async function deleteContribution(req,res){
    const {id}= req.params;
    try {
        const findContibution = await prisma.contribution.findUnique({where:{id:parseInt(id,10)}});
        if(!findContibution){
            res.status(404).send('Not found contribution');
        }
        await prisma.contribution.delete({where:{id:parseInt(id,10)}});
        res.status(200).json({success:true});
    } catch (error) {
        console.error("erreur lors de la suppression d\'une contribution");
        res.status(500).send({message:error.status});
    }
}

module.exports = {
    getContribution,
    getContributionById,
    createNewContribution,
    deleteContribution
}