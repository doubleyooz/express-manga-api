import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${env.process.GMAIL_USER}`,
        pass: `${env.process.GMAIL_PASSWORD}`,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
