import { NextApiRequest, NextApiResponse } from "next";
import { updateCategoryStatus } from "../controller";
// import { useRouter } from 'next/router'

interface ResponseData {
    error?: string;
    msg?: string;
    data?: any;
}

export default async function handler ( req: NextApiRequest, res: NextApiResponse<ResponseData> )  {
    try {
        const { method } = req;

        // to check useRouter not working
        // const router = useRouter();
        // const routerSlug  = router.query

        switch ( method ) {
            case "PATCH":
                return await updateCategoryStatus(req, res);
            default:
                return res.status(405).json({ error: `Method ${method} Not Allowed` });
        }
    } catch ( error: any ) {
        return res.status(500).json({ error: error.message });
    }
    
}