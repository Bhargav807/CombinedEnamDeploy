import mongoose from "mongoose";




const ProductSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    sellerId:{
        type: mongoose.ObjectId,
        ref: "users",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    photo: {
        data: Buffer,
        contentType: String,

    },
    shipping: {
        type: Boolean,
    },
    organic: {
        type: Boolean,
    },
    quality:{
        type:Number,
        default:"5.0"
    },
    quantityUnit:{
        type:String,
        default:"5.0",
        required:true
    },
    availableDate: { 
        type: String,
        required: true 
    }

}, { timestamps: true }
)


export default mongoose.model("products", ProductSchema);