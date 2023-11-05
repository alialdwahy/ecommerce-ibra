const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRoute");


const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const  cors =  require("cors");
dbConnect();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());


app.use("/api/user", userRouter);


 

// app.listen(process.env.PORT || 3000, function(){
//     console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
//   });

app.listen(PORT, () => {
    console.log(`server is running at Port ${PORT}`);
});