
function validateOTP(InputOtp, storedOtp, otpExpiry) {
    const currentTime=new Date();

    console.log("current time",currentTime)
    
    console.log("OTPexpiryTime",otpExpiry)
    const isExpired = currentTime > otpExpiry;

    if (isExpired)
        { 
            console.log("otp expires")
            return {success:false, message:"OTP expired" };
        }
    if (InputOtp!== storedOtp)
        {
            console.log("otp is invalid")
            return {success: false, message:"Invalid OTP" };
        }

    return {success:true, message:"OTP verified" };
}

module.exports = validateOTP;
