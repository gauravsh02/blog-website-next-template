import { NextApiRequest, NextApiResponse } from "next";
import User from "../../model/User";
import bcrypt from "bcrypt";
import utils from "../../utils/utils";
import { v4 as uuidv4 } from "uuid";

interface ResponseData {
    error?: string;
    msg?: string;
  }

const signupDataValidatoin = async (name: string, email: string, password: string) => {
    if(name.length < 3) {
        return { error: "Name must have more than 3 characters"};
    }

    if( !utils.isValidEmail( email ) ) {
        return { error: "Email is invalid"};
    }

    if( !utils.isValidPassword( password ) ) {
        return { error: "Password is invalid"};
    }

    return null;
}

export default async function handler ( req: NextApiRequest, res: NextApiResponse<ResponseData> )  {
    // validate if it is a POST
    if (req.method !== "POST") {
        return res.status(400).json({ error: "This API call only accepts POST methods" });
    }

    // get and validate body variables
    const { name, email, password } = req.body;

    const errorMessage = await signupDataValidatoin(name, email, password);
    if (errorMessage) {
        return res.status(400).json(errorMessage as ResponseData);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
        userId: uuidv4(),
        name: name,
        email: email,
        hashedPassword: hashedPassword,
        role: 'member'
    });

    try {
        await newUser.save();
        res.status(200).json({ msg: "Successfuly created new User: " + name })
    } catch ( error:any ) {
        if (error.name === "ValidationError") {
            let errors: any = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).send(errors);
        }
        res.status(500).json({ error: "Error on '/api/register': "  })
    }


}