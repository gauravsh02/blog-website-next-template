import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import nodemailer from "nodemailer";

type Data = {
    data: any
}

interface SearchFn {
    ( toMail: string, subject: string, mailText: string, mailHTML: string): Promise<boolean>;
}

// export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
export async function sendMail( toMail: string, subject: string, mailText: string, mailHTML: string ) : Promise<boolean> {
    // const session = await getSession({ req });
    // if(!session) {
    //     res.status(403).json({ data: 'You must be sign in to view the protected content on this page.' });
    // }
    return new Promise(async(resolve, reject) => {
        const transporter = nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            },
            secure: true,
        });
    
        const subj = "Subj";
    
        const mailData = {
            from: process.env.NODEMAILER_EMAIL,
            to: toMail,
            subject: subject,
            text: mailText,
            html: mailHTML
        }
    
        let mailsend = await transporter.sendMail(mailData, function (err: any, info: any) {
            if(err) {
                reject(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
