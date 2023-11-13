const multer = require("multer");
const sharp = require('sharp');
const path = require("path");
const fs = require("fs");
const { Z_ASCII } = require("zlib");


const multerStorage = multer.diskStorage({
    destination: function (req, file, cd) {
      cd(null, path.join(__dirname, "../public/images"));
    },
    filename: function (req, file, cd) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() );
        cd(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    }
});


const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    }
    else {
        cb({
            message: "Unsupported file format"
        },false
        );
    }
};

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fileSize: 2000000},
});



const productImageResize = async (req, res, next ) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
        await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({quality: 90})
        .toFile(`public/images/products/${file.filename}`);
        fs.unlinkSync(`public/images/products/${file.filename}`);
    })
  );
next();
};



const blogImageResize = async (req, res, next ) => {
    if (!req.files) return next();
    await Promise.all(
      req.files.map(async (file) => {
          await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({quality: 90})
          .toFile(`public/images/blogs/${file.filename}`);
          fs.unlinkSync(`public/images/blogs/${file.filename}`);
      })
    );
  next();
  };

module.exports = {uploadPhoto, blogImageResize, productImageResize};