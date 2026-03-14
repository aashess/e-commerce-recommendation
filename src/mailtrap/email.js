import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplate.js'
import {sender, mailtrapClient} from './mailtrap.config.js'

export const sendVerficationEmail = async (email, verificationToken) => {
    const recipient  = ["work.aashesh@gmail.com"]
    
    console.log(recipient);
    

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [{email: "work.aashesh@gmail.com"}],
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })
        console.log("Email Sent Successfully.", response);

        
    } catch (error) {
        console.error(`Error Sending Verification`, error);
        throw new Error(`Error Sending Verification Email: ${error}`);
    }
}