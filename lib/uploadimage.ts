import { NextApiRequest, NextApiResponse } from "next";
import {getSession} from "next-auth/react";
import ImageKit from "imagekit";

export async function uploadImageToImageKit ( fileObj:any ) {

    // req: NextApiRequest,

    // const session = await getSession({ req });
    // if(!session) {
    //     throw new Error("You must be sign in to view the protected content on this page.");
    // }
    interface ImageKitInterface {
        publicKey: any;
        privateKey: any;
        urlEndpoint: any;
    }

    var imagekit:any = new ImageKit(<ImageKitInterface>{
        publicKey : process.env.IMAGE_KIT_PUBLIC_API_KEY,
        privateKey : process.env.IMAGE_KIT_PRIVATE_API_KEY,
        urlEndpoint : process.env.IMAGE_KIT_URL_ENDPOINT
    });

    try {

        const result = await imagekit.upload({
			file: fileObj.base64,
			fileName: fileObj.name,
		});

        return result.url;

    } catch (err) {
        throw new Error("Error in upload image in ImageKit");
    }

}