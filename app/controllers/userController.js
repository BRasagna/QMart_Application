const express=require('express')
const {PrismaClient}=require('@prisma/client')
const prisma=new PrismaClient();
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
require('dotenv').config();

const hashpassword=async(createpassword)=>
{
    return await bcrypt.hash(createpassword,10)
}

// REGISTRATION FOR USER AND ADMIN
const register=async(req,res)=>
{
    //object.entries converts object into array and object.fromEntries converts array into an object
    try{
        console.log("request body",req.body)
    const normalizedBody = Object.fromEntries(                      
        Object.entries(req.body).map(([key,value])=> [key.toLowerCase(),value]));

    const{email,createpassword,role}=normalizedBody;
    console.log("normalized body",normalizedBody)

        if( !email||!createpassword ||!role)
        {
            console.log(email,createpassword,role)
            return res.status(400).json({message:"All fields are required"})
        }
    
        console.log("email : ",email,"createpassword : ",createpassword,"role : ",role)
        const existingUser=await prisma.user.findUnique(
            { 
                where:{email}
            });
            
        if(existingUser)
        {
            return res.status(400).json({message:"This user already exist "})
        }
        console.log("existinguser  ",existingUser )

        const hashedpassword=await hashpassword(createpassword)
        console.log("hashedpassword ......",hashedpassword)
        const newUser=await prisma.user.create({
            data:{email,createpassword:hashedpassword,role}
    
        })
        console.log(("user is created",newUser))
    return  res.status(201).json({message:"Registration is successful",newUser})

    }
    catch(error)
    {
        console.log("error occuurs during registration ",error.message)
        return res.status(500).json({message:"Registration failed....Try again"})
    }
}
//SUPER ADMIN registration 
// const SuperAdmin_Email="sravanthi@gmail.com";
// const Default_Password=process.env.SuperAdmin_Password;
// const SuperAdmin_Role="SuperAdmin"

const superadmin=async(req,res)=> {
try{
    const { email, createPassword, confirmPassword } = req.body;
    if (!email || !createPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (createPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    const defaultSuperAdminEmail=process.env.SuperAdmin_Email;
    if(email !== defaultSuperAdminEmail)
    {
        return res.status(401).json({message:"Invalid email for superAdmin registration "})
    }

    const existingSuperAdmin = await prisma.user.findUnique({
        where: {email},
    });
    
    if (existingSuperAdmin) {
        console.log("SuperAdmin already exists:", existingSuperAdmin);
        return res.status(400).json({message:"superAdmin is already exists" ,existingSuperAdmin})
    }
    
    const passwordHashed=await bcrypt.hash(createPassword,10)
    console.log("hashed password of superadmin ",passwordHashed)

    const createdUser = await prisma.user.create({
    data: {
        email,
        createpassword: passwordHashed,
        role:"SuperAdmin"
    }
    });

    console.log("SuperAdmin created:", createdUser);
    return res.status(201).json({message:"superAdmin is created",createdUser})
    }
catch(error)
{
    console.log("error occurs during superadmin ",error.message)
    return res.status(500).json({message:"Registration failed.....Try again"})
}
}

//Login
const comparePassword=async(inputPassword,storedPassword)=>
{
    return await bcrypt.compare(inputPassword,storedPassword)
}
const generateToken=(userId,email)=>
{
    const secretKey=process.env.JWT_SECRET;
    console.log("generating the token with userId and Email : ",userId,email)
    return  jwt.sign({userId,email},secretKey,{expiresIn:'1h'})
}

const login=async(req,res)=>
{
    const normalizedBody = Object.fromEntries(                      
    Object.entries(req.body).map(([key,value])=> [key.toLowerCase(),value]));
    const {email,password} = normalizedBody;
    // const{email,password}=req.body;
    try{
    if(!email||!password)
    {
        return res.status(401).json({message:"Enter correct credentails"})
    }
    
    //fetch the user details from db
    const dbUser=await prisma.user.findUnique({
        where:{email}
    })
    console.log("user",dbUser)
    if(!dbUser){
        
        return res.status(404).json({message:"user not found in database"})
    }
    const passwordValidate=await comparePassword(password,dbUser.createpassword)
    if(!passwordValidate){
        return res.status(401).json({message:"Invalid credentails"})
    }
    const token=generateToken(dbUser.id,dbUser.email)
    return res.status(200).json({message:"Login successfully",token})
}
catch(error){
    console.log("Error occurs ",error.message)
    res.status(500).json({message:"Login fails"})
}
}
module.exports={register,login,superadmin}