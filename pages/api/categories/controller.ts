import { NextApiRequest, NextApiResponse } from "next";
import {getSession} from "next-auth/react";
import Category from "../../../model/Category";
import { v4 as uuidv4 } from "uuid";

export async function getCategoriesList ( req: NextApiRequest ) {

    const session = await getSession({ req });
    if(!session) {
        throw new Error("You must be sign in to view the protected content on this page.");
    }

    interface pageOptionsInterface {
        page?: any
        per_page?: any
    }

    try {
        const pageOptions = <pageOptionsInterface>{
            page: Number(req?.query?.page || 1),
            per_page: Number(req?.query?.per_page || 10)
        };

        const data = await Category.find().select("categoryId categoryName categoryStatus").skip((pageOptions.page ? pageOptions.page - 1 : 0) * pageOptions.per_page).limit(pageOptions.per_page).sort({createdAt: "desc"});
        const totalCount = await Category.countDocuments();
        return {data: data, pagination: {...pageOptions, total_count: totalCount} };
    } catch (error) {
        throw new Error("Error While fetching data.");
    }
    
}

export async function createCategory ( req: NextApiRequest, res: NextApiResponse ) {
    
    const session = await getSession({ req });
    if(!session) {
        throw new Error("You must be sign in to view the protected content on this page.");
    }

    const { categoryName, categoryStatus } = req.body;

    const newCategory = new Category({
        categoryId: uuidv4(),
        categoryName: categoryName,        
        categoryStatus: categoryStatus
    });

    try {
        await newCategory.save();
        return res.status(200).json({ msg: "Category created successfuly" });
    } catch ( error:any ) {
        if (error.name === "ValidationError") {
            let errors: any = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).send(errors);
        }
        return res.status(500).json({ error: "Error on '/category'"  });
    }

}

export async function deleteCategory ( req: NextApiRequest, res: NextApiResponse ) {
    const session = await getSession({ req });
    if(!session) {
        throw new Error("You must be sign in to view the protected content on this page.");
    }
    
    const { categoryId } = req.body;

    try {
        await Category.find({ categoryId: categoryId }).remove();
        return res.status(200).json({ msg: "Category deleted successfuly" });
    } catch ( error:any ) {
        if (error.name === "ValidationError") {
            let errors: any = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).send(errors);
        }
        return res.status(500).json({ error: "Error on '/category'"  });
    }
}

export async function updateCategoryStatus ( req: NextApiRequest, res: NextApiResponse ) {
    const session = await getSession({ req });
    if(!session) {
        throw new Error("You must be sign in to view the protected content on this page.");
    }
    
    const { categoryId, categoryStatus } = req.body;

    try {
        await Category.findOneAndUpdate({ categoryId: req.query.categoryId }, {categoryStatus: categoryStatus} );
        return res.status(200).json({ msg: "Updated successfuly" });
    } catch ( error:any ) {
        if (error.name === "ValidationError") {
            let errors: any = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).send(errors);
        }
        return res.status(500).json({ error: "Error on '/category'"  });
    }
}

export async function updateCategory ( req: NextApiRequest, res: NextApiResponse ) {
    const session = await getSession({ req });
    if(!session) {
        throw new Error("You must be sign in to view the protected content on this page.");
    }
    
    const { categoryId, categoryName, categoryStatus } = req.body;

    try {
        await Category.findOneAndUpdate({ categoryId: req.query.categoryId }, { categoryName: categoryName, categoryStatus: categoryStatus } );
        return res.status(200).json({ msg: "Updated successfuly" });
    } catch ( error:any ) {
        if (error.name === "ValidationError") {
            let errors: any = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).send(errors);
        }
        return res.status(500).json({ error: "Error on '/category'"  });
    }
}

export async function getAllActiveCategory ( req: NextApiRequest, res: NextApiResponse ) {
    const session = await getSession({ req });
    if(!session) {
        throw new Error("You must be sign in to view the protected content on this page.");
    }

    try {
        const data = await Category.find({ categoryStatus: true }).select("categoryId categoryName").sort({createdAt: "desc"});
        return res.status(200).json({ msg: "success", data: data });
    } catch ( error:any ) {
        if (error.name === "ValidationError") {
            let errors: any = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).send(errors);
        }
        return res.status(500).json({ error: "Error on '/category'"  });
    }
}