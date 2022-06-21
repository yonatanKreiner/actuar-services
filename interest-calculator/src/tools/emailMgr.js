const nodemailer = require('nodemailer');

const emailUsername = process.env.emailUser || "actuarit.bot@gmail.com";
const emailPassword = process.env.emailPassword || "actuar1203";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUsername,
        pass: emailPassword
    }
});
  
const calculatorUsesContactEmail = async (email, calcType) => {
    const mailOptions = {
        from: emailUsername,
        to: emailUsername,
        subject: 'לקוח נוסף משתמש במחשבוני אקטוארית',
        text: `הלקוח ${email} משתמש במחשבון - ${calcType}`
    };
   
    try{
        await transporter.sendMail(mailOptions);
    }catch(err) {
        console.log(err);
    }
}

module.exports = {calculatorUsesContactEmail};