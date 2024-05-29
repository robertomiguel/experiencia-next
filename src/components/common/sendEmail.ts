import { Email } from '@/types/email';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendEmail = async (props: Email) => {

    const msg = {
        to: props.to,
        from: process.env.SENDGRID_EMAIL_FROM || '',
        subject: props.subject,
        text: props.text,
        html: props.html,
    }
    try {
        await sgMail.send(msg)
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}