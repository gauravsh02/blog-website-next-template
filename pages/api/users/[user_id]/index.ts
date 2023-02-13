import { NextApiRequest, NextApiResponse } from "next";
import { getUserList } from "../controller";

interface ResponseData {
    error?: string;
    msg?: string;
    data?: any;
}

export default async function handler ( req: NextApiRequest, res: NextApiResponse<ResponseData> )  {
    try {
        const { method } = req;

        switch ( method ) {
            case "GET":
                // todo change getuserlist to getuserbyid
                const data = await getUserList(req);
                return res.status(200).json({ msg: "success", data: data})
            case "POST":
                return res.status(200).json({ msg: "success", data: req.query})
            default:
                return res.status(405).json({ error: `Method ${method} Not Allowed` });
        }
    } catch ( error: any ) {
        return res.status(500).json({ error: error.message });
    }
    
}