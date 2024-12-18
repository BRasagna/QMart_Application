const nodemailer=require('nodemailer')
require('dotenv').config();

const transporter= nodemailer.createTransport(
    {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        // user: 'defaultmailforotp@gmail.com',
        // pass: 'ggiulqchtuuejgyo'                    //app password
        user:process.env.EMAIL,
        pass:process.env.APP_PASSWORD
    }
    
    }
);
module.exports=transporter;

