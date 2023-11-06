const Product = require("../models/productModel");
const User = require("../models/usersModel");
const asyncHandler = require("express-async-handler");
const slugify = require('slugify');
const validateMongoDbId = require("../utils/validateMongodbid");
const { PassThrough } = require("nodemailer/lib/xoauth2");
const {cloudinaryUploadImg, cloudinaryDeleteImg} = require("../utils/cloudinary");
const fs = require("fs");




const createProduct = asyncHandler(async (req, res) => {
    try{
        if ( req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
       const newProduct = await Product.create(req.body);
       res.json(newProduct);
    }catch (error) {
        throw new Error(error);
    }
});


const updateProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
  
    try{
        if ( req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
       const updateProduct = await Product.findByIdAndUpdate(
            id , req.body, {
                new:true
            });
       res.json(updateProduct);
    }catch (error) {
        throw new Error(error);
    }
});


const deleteProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try{
       const deleteProduct = await Product.findByIdAndDelete( id );
       res.json(deleteProduct);
    }catch (error) {
        throw new Error(error);
    }
});


const getaProduct = asyncHandler(async (req,res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});


const getAllProduct = asyncHandler(async (req,res) => {
    try {
        // Filtering 
        const querObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach( (el) => delete querObj[el]);
             console.log(querObj);
          let queryStr = JSON.stringify(querObj);
          queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
            
        let query =  Product.find(JSON.parse(queryStr));


       // Sorting
       if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
       } else {
        query = query.sort("-createAt");
       }

        // Limiting the Fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
           } else {
            query = query.sort("-__v");
           }

         // Pageination 
         const page = req.query.page;
         const limit = req.query.limit;
         const skip = (page - 1) * limit;
         query = query.skip(skip).limit(limit);
            if (req.query.page) {
                const productCount = await Product.countDocuments();
                if (skip >= productCount) throw new Error("This page does not exists");
            }


        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});




const addToWishlist = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {prodId} = req.body;

    try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
         if (alreadyadded) {
            let user = await User.findByIdAndUpdate (_id, {
                $pull: {wishlist: prodId},
            },
            {
                new: true,
            }
            );
            res.json(user);
         }else {
            let user = await User.findByIdAndUpdate (_id, {
                $push: {wishlist: prodId},
            },
            {
                new: true,
            }
            );
            res.json(user);
         }
    } catch (error) {
        throw new Error(error);
    }
});


const rating = asyncHandler( async (req, res) => {
      const { _id } = req.user;
      const { star, prodId, comment } = req.body;
      try{
      const product = await Product.findById(prodId);
      let alreadyRated = product.ratings.find( (usreId) => usreId.postedby.toString() === _id.toString());
      if (alreadyRated) {
           const updateRating = await Product.updateOne({
            ratings: {$elemMatch: alreadyRated},
           },
            {
                $set: {"ratings.$.star": star, "ratings.$.comment": comment},
            },
            {
                new: true,
            },
           );
           res.json(updateRating);

      } else {
        const rateProduct = await Product.findByIdAndUpdate (prodId, {
            $push: {ratings: {
                star: star,
                comment: comment,
                postedby: _id,

            }},
        },
        {
            new: true,
        }
        );
      };
      const getallrating = await Product.findById(prodId);
      let totalRating = getallrating.ratings.length;
      let ratingsum = getallrating.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
      let actualRating = Math.round(ratingsum / totalRating);
      let finalproduct = await Product.findByIdAndUpdate( prodId ,{
         totalrating: actualRating,
      },
      {
        new: true,
      },
      );
      res.json(finalproduct);
    } catch (error) {
        throw new Error(error);
    }
});


const uploadImages = asyncHandler (async (req, res) => {
   try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
        const { path } = file;
        const newpath = await uploader(path);
        console.log(newpath);
        urls.push(newpath);
        fs.unlinkSync(path);
    }
    const images = urls.map((file) => {
        return file;
    });
    res.json(images);
   } catch (error) {
    throw new Error(error);
   }
});


const deleteImages = asyncHandler (async (req, res) => {
    const { id } = req.params;
    try {
     const uploader = cloudinaryDeleteImg(id,"images");
       res.json({message: "deleted"})
    } catch (error) {
     throw new Error(error);
    }
 });
 
 

module.exports = { createProduct,  getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages, deleteImages}