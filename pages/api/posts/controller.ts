import { NextApiRequest, NextApiResponse } from "next";
import {getSession} from "next-auth/react";
import Post from "../../../model/Post";
import User from "../../../model/User";
import { v4 as uuidv4 } from "uuid";
import { uploadImageToImageKit } from "../../../lib/uploadimage";
import dbConnect from "../../../lib/dbConnect";

export async function getPostList ( req: NextApiRequest ) {

    // interface UpdateSession {
    //     user?: {
    //         name?: string | null;
    //         email?: string | null;
    //         image?: string | null;
    //         userId?: string | null;
    //     };
    //     expires: ISODateString;
    // }
    await dbConnect();
    const session = await getSession({ req });
    if(!session) {
        throw new Error("You must be sign in to view the protected content on this page.");
    }

    interface pageOptionsInterface {
        page?: any
        per_page?: any
    }

    try {
        // check here we have changed .query to .body
        const pageOptions = <pageOptionsInterface>{
            page: Number(req?.query?.page || 1),
            per_page: Number(req?.query?.per_page || 10)
        };

        const { userId }:any = session?.user;

        const data = await Post.find({authorId: userId, isArchived: false}).select("postId title slug summary content tags category bannerImage isPublished createdAt updatedAt").skip((pageOptions.page ? pageOptions.page - 1 : 0) * pageOptions.per_page).limit(pageOptions.per_page).sort({createdAt: "desc"});
        const totalCount = await Post.count({authorId: userId, isArchived: false});
        return {data: data, pagination: {...pageOptions, total_count: totalCount} };
    } catch (error) {
        throw new Error("Error While fetching data.");
    }
    
}

export async function createPost ( req: NextApiRequest, res: NextApiResponse ) {
    await dbConnect();
    const session = await getSession({ req });
    if(!session) {
        throw new Error("You must be sign in to view the protected content on this page.");
    }

    try {

        const { title, slug, summary, content, tags, category, bannerImageFile } = req.body;

        const bannerImageIK = await uploadImageToImageKit(bannerImageFile);

        const { userId }:any = session?.user;

        const newPost = new Post({
            postId: uuidv4(),
            title: title,
            slug: slug,
            summary: summary,
            content: content,
            tags: tags,
            category: category,
            isPublished: false,
            authorId: userId,
            bannerImage: bannerImageIK
        });

        await newPost.save();
        return res.status(200).json({ msg: "Post created successfuly" });
    } catch ( error:any ) {
        if (error.name === "ValidationError") {
            let errors: any = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).send({error: "ValidationError", errorList: errors});
        }
        if(error.code === 11000) {
            return res.status(500).json({ error: "Duplicate entry in Slug not allowed"  });
        }
        return res.status(500).json({ error: "Error on '/post'"  });
    }

}

export async function updatePost ( req: NextApiRequest, res: NextApiResponse ) {
    await dbConnect();
    const session = await getSession({ req });
    if(!session) {
        throw new Error("You must be sign in to view the protected content on this page.");
    }

    try {

        const { userId }:any = session?.user;

        const { postId, title, slug, summary, content, tags, category, bannerImage, bannerImageFile } = req.body;

        let updatedBannerImage;
        if(bannerImageFile) {
            updatedBannerImage = await uploadImageToImageKit(bannerImageFile);
        }

        const postUpdate = await Post.findOneAndUpdate({ postId: postId, authorId: userId+'MMM' }, { title: title, slug: slug, summary: summary, content: content, tags: tags, category: category, bannerImage: (updatedBannerImage ? updatedBannerImage : bannerImage) } );

        if(!postUpdate) {
            return res.status(400).send({error: "Something Went Worng", errorList: []});
        }

        return res.status(200).json({ msg: "Post updated successfuly" });
    } catch ( error:any ) {
        if (error.name === "ValidationError") {
            let errors: any = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).send({error: "ValidationError", errorList: errors});
        }
        return res.status(500).json({ error: "Error on '/post'"  });
    }

}

export async function updatePostStatus ( req: NextApiRequest, res: NextApiResponse ) {
    await dbConnect();
    const session = await getSession({ req });
    if(!session) {
        throw new Error("You must be sign in to view the protected content on this page.");
    }
    
    const { postId, isPublished } = req.body;

    try {
        await Post.findOneAndUpdate({ postId: postId }, {isPublished: isPublished} );
        return res.status(200).json({ msg: "Updated successfuly" });
    } catch ( error:any ) {
        if (error.name === "ValidationError") {
            let errors: any = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).send(errors);
        }
        return res.status(500).json({ error: "Error on '/post/{}/status'"  });
    }    

}

export async function archivePost ( req: NextApiRequest, res: NextApiResponse ) {
    await dbConnect();
    const session = await getSession({ req });
    if(!session) {
        throw new Error("You must be sign in to view the protected content on this page.");
    }
    
    const { postId, isPublished } = req.body;

    try {
        await Post.findOneAndUpdate({ postId: postId }, {isArchived: true} );
        return res.status(200).json({ msg: "Updated successfuly" });
    } catch ( error:any ) {
        if (error.name === "ValidationError") {
            let errors: any = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).send(errors);
        }
        return res.status(500).json({ error: "Error on '/post/{}/status'"  });
    }    

}

export async function getPublicPostList ( req: NextApiRequest, res: NextApiResponse ) {

    try {

        const count:number = Number(req?.query?.count || 3);

        await dbConnect();

        // const data = await Post.find({ isArchived: false }).select("postId title slug summary content tags category bannerImage isPublished createdAt updatedAt").limit( count ).sort({updatedAt: "desc"});
        const data = await getPublicPostCommon( count );
        return res.status(200).json({ msg: "success", data: data });
    } catch (error) {
        throw new Error("Error While fetching data.");
    }    

}

export async function getPublicPostCommon ( count:number ) {

    try {
        await dbConnect();
        const data = await Post.find({ isArchived: false, isPublished: true }).select("postId title slug summary content tags category bannerImage isPublished createdAt updatedAt").limit( count ).sort({updatedAt: "desc"});
        return data;
    } catch (error) {
        throw new Error("Error While fetching data.");
    }    

}

export async function getPublicPostDataBySlug ( req: NextApiRequest, res: NextApiResponse ) {
    try {
        await dbConnect();
        const { slug } = req.query;
        const data = await Post.find({ isArchived: false, isPublished: true, slug: slug }).select("postId title slug summary content tags category bannerImage authorId createdAt updatedAt");
        const authorData = await User.find({ userId: data[0]["authorId"] }).select("name image");
        const postData = { postId: data[0]["postId"], title: data[0]["title"], slug: data[0]["slug"], bannerImage: data[0]["bannerImage"], summary: data[0]["summary"], content: data[0]["content"], tags: data[0]["tags"], category: data[0]["category"], publishedAt: data[0]["publishedAt"], authorData: { name: authorData[0]["name"], image: authorData[0]["image"]}};
        return data.length === 1 ? res.status(200).json({ msg: "success", data: postData }) : res.status(404).json({ msg: "Post not found", data: [] }) ;
    } catch (error) {
        throw new Error("Error While fetching data.");
    }
}