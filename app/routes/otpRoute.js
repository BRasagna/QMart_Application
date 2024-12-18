const express=require('express')
const router=express.Router();
const {sendOTP,verifyOTP}=require('../controllers/OtpController')

router.post('/sendotp',sendOTP)
router.post('/OTPforValidate',verifyOTP)


module.exports=router;