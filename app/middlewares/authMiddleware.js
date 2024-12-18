
const express=require('express')
const {PrismaClient} =require('@prisma/client')
const prisma=new PrismaClient();
require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifySuperAdmin=async(req,res,next)=>
    {
        const authHeader=req.headers.authorization;
        console.log(authHeader);

        if(!authHeader)
        {
            return res.status(400).json({error:"unauthorized acces"});
        
        }
        const token=authHeader.split(' ')[1];
        try{
            console.log("Authorization header:", req.headers.authorization);
            console.log("Token:", token);
    
            const decode=jwt.verify(token,process.env.JWT_SECRET)

            console.log("decoded token:",decode)

            const email=decode.email;

            const user=await prisma.user.findUnique({
                where:{email}
            })
            // if(user.role!=="SuperAdmin")
            // {
            //     return res.status(403).json({message:"not authorized"})
            // }
            // req.user=decode;
            return res.status(200).json({message:"successfully decode the token "})
            next();
            // console.log("before catch");
        }
        
        catch(error)
        {
            console.log("error occured",error)
            return res.status(401).json({error:"invalid token"})
        }
    }
    module.exports=verifySuperAdmin;