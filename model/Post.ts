import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema({
    postId: {
        type: String,
        requeired: true,
        unique: true,
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    bannerImage: {
        type: String,
        default: ''
    },
    summary: {
        type: String,
        required: true 
    },
    content: {
        type: String,
        required: true
    },
    tags : {
        type: [String]
    },
    category: {
        type: [String]
    },
    publishedAt: {
        type: Date
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    authorId: {
        type: String,
        required: true
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

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;