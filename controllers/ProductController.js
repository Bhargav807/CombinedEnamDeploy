import slugify from "slugify";
import ProductModel from "../models/ProductModel.js"
import fs from "fs";
import userModel from "../models/userModel.js";


export const createProductController = async (req, res) => {
    try {
        console.log("Error")
        console.log(req.files)
        const { name, slug, description, price, quantity, shipping, organic,quantityUnit } = req.fields;
        const { photo } = req.files;

        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required!" })
            case !description:
                return res.status(500).send({ error: "description is required!" })
            case !price:
                return res.status(500).send({ error: "price is required!" })
            case !organic:
                return res.status(500).send({ error: "organic is required!" })

            case !quantity:
                return res.status(500).send({ error: "quantity is required!" })
            case !shipping:
                return res.status(500).send({ error: "shipping is required!" })
            case !photo || (photo && photo.size > 1000000):
                return res.status(500).send({ error: "Photo is required, and less than 1MB!" })


            default:
                break;
        }

        const product = new ProductModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }

        await product.save()
        res.status(201).send({
            success: true,
            message: "product created successfully!",
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in creating product",
            error
        })
    }
}


///get products controller to list posted products

export const getProductController = async (req, res) => {


    try {
        const userId = req.user._id;
        const products = await ProductModel.find({ sellerId: userId }).populate("sellerId").select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            message: true,
            message: "All products",
            products,
            totalcount: products.length,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting products",
            error
        })
    }

}


//getAllProductController posted by other users

export const getAllProductController = async (req, res) => {

    try {
        const userId = req.user._id;
        const products = await ProductModel.find({ sellerId: { $ne: userId } }).populate("sellerId").select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            message: true,
            message: "All products",
            products,
            totalcount: products.length,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting products",
            error
        })
    }
}



//get single product controller

export const getSingleProductController = async (req, res) => {
    console.log(req.params.id)
    try {
        const product = await ProductModel.findById(req?.params.id).select("-photo").populate("sellerId");

        res.status(200).send({
            success: true,
            message: "Single product fetched!",
            product

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "error in getting the product",
            success: false,

        })
    }
}


//get photo

export const productPhotoController = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid).select("photo")

        if (product.photo.data) {
            res.set("content-type", product.photo.contentType)
            return res.status(200).send(
                product.photo.data)
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting photo",
            error

        })
    }
}


//delete product controller
export const deleteProductController = async (req, res) => {
    try {


        await ProductModel.findByIdAndDelete(req?.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: "Product deleted succcessfully!",

        })

    } catch (error) {
        console.log(error)
        res.status(200).send({
            success: false,
            message: "Error in deleting product",
            error
        })
    }
}




///update product controller

export const updateProductController = async (req, res) => {
    try {

        console.log("Error")
        console.log(req.files)
        const { name, description, price, quantity, shipping } = req.fields;
        //const { photo } = req.files;

        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required!" })
            case !description:
                return res.status(500).send({ error: "description is required!" })
            case !price:
                return res.status(500).send({ error: "price is required!" })

            case !quantity:
                return res.status(500).send({ error: "quantity is required!" })
            case !shipping:
                return res.status(500).send({ error: "shipping is required!" })
            //case !photo && photo.size > 1000000:
            //    return res.status(500).send({ error: "Photo is required, and less than 1MB!" })

            default:
                break;
        }

        const product = await ProductModel.findByIdAndUpdate(req?.params.pid, {
            ...req.fields, slug: slugify(name)
        }, { new: false })
        /*

        */

        await product.save()
        res.status(201).send({
            success: true,
            message: "product updated successfully!",
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in updating product",
            error
        })
    }
}


//export const productFilterController
export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) {
            args.category = checked;
        }
        if (radio.length) {
            console.log(radio)
            args.price = { $gte: radio[0], $lte: radio[1] };
        }
        const productss = await ProductModel.find(args)
        res.status(200).send({
            success: true,
            productss,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Some error occured in product filter controller"
        })
    }
}

// proposedListController
export const proposedListController = async (req, res) => {
    try {
        const { userid } = req.body;

        if (!userid) {
            console.log("userid not found");
            return res.status(500).send({
                success: false,
                message: "userid not found",
            });
        }

        // Find the user by userid
        const user = await userModel.findById(userid);

        if (!user) {
            console.log("User not found");
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        // Extract the proposed list from the user document
        const proposedList = user.proposalsSent;

        res.status(200).send({
            success: true,
            message: "Proposed list retrieved successfully",
            proposedList,
            count: proposedList.length
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Some error occurred while retrieving proposed list",
            error
        });
    }
};

//export const proposeOffer
export const proposeOffer = async (req, res) => {
    try {
        const { buyerid, pid, sellerid } = req.body;

        // Validation for required fields
        if (!buyerid || !pid || !sellerid) {
            return res.status(400).send({
                success: false,
                message: "buyerid, pid, or sellerid not provided",
            });
        }

        // Update proposalsSent for buyer
        const buyerUpdate = await userModel.findByIdAndUpdate(
            buyerid,
            { $addToSet: { proposalsSent: pid } },
            { new: true }
        );

        // Update proposalsReceived for seller
        const sellerUpdate = await userModel.findByIdAndUpdate(
            sellerid,
            { $addToSet: { [`proposalsReceived.${pid}`]: buyerid }, $set: { updatedAt: new Date() } },
            { new: true, upsert: true }
        );

        // Check if updates were successful
        if (!buyerUpdate || !sellerUpdate) {
            console.log("Failed to update proposals");
            return res.status(500).send({
                success: false,
                message: "Failed to update proposals",
            });
        }

        // Both updates were successful
        console.log("Propose offer successful");

        res.status(200).send({
            success: true,
            message: "Offer proposed successfully",
            buyerUpdate,
            sellerUpdate
        });

    } catch (error) {
        console.error("Error proposing offer:", error);
        res.status(500).send({
            success: false,
            message: "Some error occurred in proposing offer",
            error
        });
    }
};





//export const decline offer

export const declineoffer = async (req, res) => {
    try {
        const { userid, pid } = req.body;

        if (!userid) {
            console.log("userid not found")
            return res.status(500).send({
                success: false,
                message: "userid not found",
            })
        }
        if (!pid) {
            console.log("pid not found")
            return res.status(500).send({
                success: false,
                message: "pid not found",
            })
        }

        // Find the user by userid and update the proposed array
        const updatedUser = await userModel.findByIdAndUpdate(
            userid,
            { $pull: { proposalsSent: pid } }, // Append the pid to the proposed array
            { new: true } // Return the updated document
        );




        if (!updatedUser) {
            console.log("User not found");
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Offer proposed successfully",
            updatedUser,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Some error occurred in proposing offer",
            error
        });
    }
}
