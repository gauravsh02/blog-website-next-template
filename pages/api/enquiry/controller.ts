import { NextApiRequest, NextApiResponse } from "next";
import User from "../../../model/User";
import Enquiry from "../../../model/Enquiry";
import bcrypt from "bcrypt";
import utils from "../../../utils/utils";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "../../../lib/sendmail"
import dbConnect from "../../../lib/dbConnect";

export async function newEnquiry( req: NextApiRequest, res: NextApiResponse ) {
    await dbConnect();
    const { name, email, contactNumber, enquiryType } = req.body;

    try {

        const foundUser = await User.findOne({ email: email }); 

        let userId;

        if(foundUser && foundUser.userId) {
            userId = foundUser.userId;
        } else {
            const hashedPassword = await bcrypt.hash(contactNumber, 12);
            userId = uuidv4();
        
            const newUser = new User({
                userId: userId,
                name: name,
                email: email,
                contactNumber: contactNumber,
                hashedPassword: hashedPassword,
                role: 'member'
            });

            await newUser.save();
        }

        const enq = new Enquiry({
            enquiryId: uuidv4(),
            userId: userId,
            name: name,
            email: email,
            contactNumber: contactNumber,
            type: enquiryType ? enquiryType : 'default'
        });

        enq.save();

        let enqType = enquiryType ? enquiryType : 'default';

        const subject = `Thanks for Enquiry for ${enqType}`;
        const mailText = `Thanks for Enquiry for ${enqType}`;
        const mailHTML = `Thanks for Enquiry for ${enqType}`;

        const mailSend = await sendMail(email, subject, mailText, mailHTML);

        if (mailSend) {
            return res.status(200).json({ msg: "ThankYou for your edquiry. We will contact you soon." })
        } else {
            return res.status(400).json({ message: 'Mail Not send' })
        }

    } catch ( error:any ) {
        if (error.name === "ValidationError") {
            let errors: any = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).send(errors);
        }
        res.status(500).json({ error: "Error on '/api/registerenquiry'"  })
    }

}