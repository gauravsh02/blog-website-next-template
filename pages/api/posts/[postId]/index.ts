import { NextApiRequest, NextApiResponse } from "next";
import { updatePost, archivePost } from "../controller";

interface ResponseData {
    error?: string;
    msg?: string;
    data?: any;
}

export default async function handler ( req: NextApiRequest, res: NextApiResponse<ResponseData> )  {
    try {
        const { method } = req;

        switch ( method ) {
            case "PUT":
                return await updatePost(req, res);
            case "DELETE":
                return await archivePost(req, res);
            default:
                return res.status(405).json({ error: `Method ${method} Not Allowed` });
        }
    } catch ( error: any ) {
        return res.status(500).json({ error: error.message });
    }
    
}