
const { get } = require("mongoose");
const { generateToken } = require("../config/jwtToken");
const User = require("../models/usersModel");


const uniqid = require("uniqid");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");




const updateUser = asyncHandler(async (req, res) => {
    console.log();
    const {_id} = req.user;
    validateMongoDbId(_id);
    try {
        const updateaUser = await User.findByIdAndUpdate( _id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        },{

            new: true,
        });
        res.json(updateaUser);
   } catch (error) {
        throw new Error(error);
   }
});



const getallUser = asyncHandler(async (req, res) => {
    try {
         const getUsers = await User.find();
         res.json(getUsers);
    } catch (error) {
         throw new Error(error);
    }
});



const getaUser = asyncHandler(async (req, res) => {
const {id} = req.params;
validateMongoDbId(id);
    try {
        const getaUser = await User.findById( id );
        res.json(getaUser);
   } catch (error) {
        throw new Error(error);
   }
});




const deleteaUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
        try {
            const deleteaUser = await User.findByIdAndDelete( id );
            res.json(deleteaUser);
       } catch (error) {
            throw new Error(error);
       }
    });



 const getWishlist = asyncHandler( async (req, res) => {
    const { _id } = req.user;
    try {
        const findUser = await User.findById(_id).populate('wishlist');
        res.json(findUser);
    } catch (error) {
        throw new Error(error);
    }
 });

 const saveAddress = asyncHandler( async (req, res) => {
    const {_id } = req.user;
    validateMongoDbId(_id);
    try {
       const updateUser = await User.findByIdAndUpdate( _id, {
        address: req?.body?.address,
       },{
        new: true,
       }
       );
       res.json(updateUser);
    }catch (error) {
        throw new Error(error);
    }
 });



module.exports = {
     getallUser,
      getaUser, 
      deleteaUser,
       updateUser ,
       getWishlist,
       saveAddress,
};