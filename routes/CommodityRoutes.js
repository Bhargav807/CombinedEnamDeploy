import express from "express";
import { requireSignIn, isAdmin, isUser } from "../middlewares/authMiddleware.js"
import {
    createProductController,
    productFilterController,
    updateProductController,
    productPhotoController,
    deleteProductController,
    getProductController,
    getSingleProductController,
    getAllProductController,
    proposeOffer,
    proposedListController,
    declineoffer
}
    from "../controllers/ProductController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes

router.post('/create-product', requireSignIn, formidable(), createProductController)

//get all posted products only
router.get("/get-products", requireSignIn, isUser, getProductController)

//get all products
router.get("/get-all-products", requireSignIn, isUser, getAllProductController)

//get single product
router.get("/get-product/:id", requireSignIn, isUser, getSingleProductController)

//get photo route
router.get("/product-photo/:pid", productPhotoController)

//delete product route
router.get("/delete-product/:pid", deleteProductController)

//update product
router.put("/update-product/:pid", requireSignIn, isUser, formidable(), updateProductController)

//filter routes
router.post("/product-filter", productFilterController)


//propose offer
router.post("/propose",requireSignIn,isUser, proposeOffer)


//decline offer
router.post("/decline",requireSignIn,isUser, declineoffer)


//proposed list 
router.post("/proposedlist",requireSignIn,isUser, proposedListController)

export default router;