const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");





const createCoupon = asyncHandler( async (req, res) => {
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllCoupon = asyncHandler( async (req, res) => {
     try {
        const getAllcoupon = await Coupon.find();
        res.json(getAllcoupon);
     } catch (error) {
        throw new Error(error);
     }
});

const updateCoupon = asyncHandler( async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const updateaCoupon = await Coupon.findByIdAndUpdate(id ,req.body, {
            new: true,
        });
        res.json(updateaCoupon);
    } catch (error) {
        throw new Error(error);
    }
});



const deleteCoupon = asyncHandler( async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deletCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createCoupon, getAllCoupon, updateCoupon, deleteCoupon};