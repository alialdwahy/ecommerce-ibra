const Category = require('../models/productCategoryModel');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");

const createProductCategory = asyncHandler( async (req, res) => {
    try {
        const newProductCategory = await Category.create(req.body);
        res.json({
            status:true,
            message:"Successfully",
           data:{
            newProductCategory}
        });
    } catch (error) {
        res.json({
            status:false,
            message:"Category Not Added",
        });
    }
});

const updateProductCategory = asyncHandler( async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updatedProductCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({
            status:true,
            message:"Updated Successfully",
           data:{
            updatedProductCategory}
        });
    } catch (error) {
        res.json({
            status:false,
            message:"Category Not Updated",
        });
    }
});

const deleteProductCategory = asyncHandler( async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deletedProductCategory = await Category.findByIdAndDelete(id);
        res.json({ 
             status:true,
            message:"Deleted Successfully",
            date:{deletedProductCategory}
        });
    } catch (error) {
        res.json({
            status:false,
            message:"Category Not Deleted",
        });
    }
});


const getProductCategory = asyncHandler( async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaProductCategory = await Category.findById(id);
        res.json( {
             status:true,
            message:"Successfully",
           data:{getaProductCategory}
        });
    } catch (error) {
        res.json({
            status:false,
            message:"Category Not Geted",
        });
    }
});


const getAllProductCategory = asyncHandler( async (req, res) => {
    try {
        const getallProductCategory = await Category.find();
        res.json({
            status:true,
           message:"Successfully",
          data:{getallProductCategory}
        });
    } catch (error) {
        res.json({
            status:false,
            message:"Categorys Not Geted",
        });
    }
});

module.exports = {createProductCategory, updateProductCategory, deleteProductCategory, getProductCategory, getAllProductCategory};