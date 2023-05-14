import { NextApiRequest, NextApiResponse } from "next";
import {getSession} from "next-auth/react";
import User from "../../../model/User";
import dbConnect from "../../../lib/dbConnect";

export async function getUserList ( req: NextApiRequest ) {
    await dbConnect();
    const session = await getSession({ req });
    if(!session) {
        throw new Error("You must be sign in to view the protected content on this page.");
    }

    try {
        const pageOptions = {
            page: Number(req?.query?.page || 1),
            per_page: Number(req?.body?.per_page || 10)
        };
        const data = await User.find().select("userId name email image role createdAt").skip((pageOptions.page ? pageOptions.page - 1 : 0) * pageOptions.per_page).limit(pageOptions.per_page).sort({createdAt: "desc"});
        const totalCount = await User.countDocuments();
        return {data: data, pagination: {...pageOptions, total_count: totalCount} };
    } catch (error) {
        throw new Error("Error While fetching data.");
    }
    
}
