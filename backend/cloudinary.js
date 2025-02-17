const express = require("express")
const multer =require("multer")
const Post=require("./models/Post.js")
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const router = express.Router()

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
});

const multerObj = multer({
    storage: multer.diskStorage({})
})

router.post("/add-product", multerObj.single("photo"), async (req, res) => {
    // Check here whether the user is admin or not????
    console.log("Adding product")

    const result = await cloudinary.uploader.upload(req.file.path)
    // If only true proceed...

    const image = result.secure_url
    console.log("This is image url ",image)
    
    return res.json({ image })

})

router.get("/", (req, res) => {

})

module.exports = router;
