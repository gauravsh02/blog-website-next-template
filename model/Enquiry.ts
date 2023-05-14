import mongoose from "mongoose";

const Schema = mongoose.Schema;

const enquirySchema = new Schema({
    enquiryId: {
        type: String,
        requeired: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false,
        default: ''
    },
    isArchived: {
        type: Boolean,
        required: false,
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

const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);
export default Enquiry;