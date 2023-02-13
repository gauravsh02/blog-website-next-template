// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";

type Data = {
    data: any
}

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data> ) {

    const session = await getSession({ req });

    if(!session) {
        res.status(403).json({ data: 'You must be sign in to view the protected content on this page.' });
    }
    // const client = await clientPromise;
    // const db = client.db("sample_mflix");

    // const db = await mongoPromise.db(process.env.MONGODB_DB);

    await dbConnect();

    const allPosts = await User.find({}).limit(10);
    res.status(200).json({ data: allPosts });

    // res.status(200).json({ name: 'John Doe' })
}
