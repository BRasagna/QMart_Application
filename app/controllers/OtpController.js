const express=require('express');
const {PrismaClient}=require('@prisma/client')
const prisma=new PrismaClient();

const transporter=require('../config/nodemailer')
const generateOTP=require('../utils/generateOTP')
const validateOTP=require('../utils/validateOTP')

const sendOTP=async(req,res)=>
{
    // const gmail='codewithtest@gmail.com';
    const {email}=req.body;
    try{

        const user = await prisma.user.findUnique({
            where: {email},
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


    const otp=generateOTP();
    const otpExpiry=new Date(Date.now()+5*60*1000);

    console.log("otp expiry : ",otpExpiry);

    //stores otp and expires in the db
    await prisma.user.update({
        where:{email},
        data:{otp,otpExpiry}

    })
    console.log("hello")
    const options={
        from: process.env.EMAIL,
        // to :'codewithtest@gmail.com',
        to: email,
        subject:'QubicMart OTP',
        html:`Your one time password [OTP] for QubicMart is:<h2>${otp}</h2> <br> please do not share this OTP with anyone to keep your account secure.`,
    }

    await transporter.sendMail(options);

    return res.status(200).json({message:'OTP send sucessfully'})
    // console.log("otp sent ")
    
    }
    catch(error)
    {
        console.log("error",error.message)
        return res.status(500).json({message:'Failed to send an OTP'})
        // console.log("otp failed ")
    }
}

const verifyOTP=async (req, res)=> {
    const {email,otp}=req.body;

    if (!email||!otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        const user =await prisma.user.findUnique({
            where: {email},
        });

        if (!user) {
            return res.status(404).json({ message: "User not found"});
        }

        const result=validateOTP(otp,user.otp,user.otpExpiry);

        if (!result.success) {
            console.log(result.success,result.message)
            return res.status(400).json({ message: result.message });
        }

        // OTP is verified, clear it from DB
        await prisma.user.update({
            where: {email},
            data: {otp: null, otpExpiry: null },
        });

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
}




module.exports={sendOTP,verifyOTP};
