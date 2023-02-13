import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
    categoryId: {
        type: String,
        requeired: true,
        unique: true
    },
    categoryName: {
        type: String,
        requeired: true
    },
    categoryStatus: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Category = mongoose.models.Category || mongoose.model("Category", categoriesSchema);
export default Category;