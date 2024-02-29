// import express from "express";
// import colors from "colors";
// import dotenv from "dotenv";
// import morgan from "morgan";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoute.js"
// import cors from "cors";
// import CategoryRoutes from "./routes/CategoryRoutes.js"
// import CommodityRoutes from "./routes/CommodityRoutes.js"
// import UserRoutes from "./routes/UserRoutes.js"
// import EquipmentRoutes from "./routes/EquipmentRoutes.js"
// import path from 'path';
// import { fileURLToPath } from 'url'
// //configure environment
// dotenv.config();

// //database config
// connectDB();

// //esmodule fix
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// //rest object
// const app = express();

// //middlewares
// app.use(cors());
// app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.static(path.join(__dirname,'./client/build')));


// //routes all
// app.use("/api/v1/auth", authRoutes);


// //category routes
// app.use("/api/v1/category", CategoryRoutes)


// //for products
// app.use("/api/v1/products", CommodityRoutes)


// //for equipment
// app.use("/api/v1/equipment",EquipmentRoutes)



// //to get userdata
// app.use("/api/v1/users", UserRoutes)


// //rest api
// app.use('*', function(req, res){
//   res.sendFile(path.join(__dirname,'./client/build/index.html'));
// });



// const PORT = process.env.PORT;

// app.listen(PORT, () => {
//   console.log(`server running on ${PORT} `.bgCyan.white);
// });

import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
import CategoryRoutes from "./routes/CategoryRoutes.js";
import CommodityRoutes from "./routes/CommodityRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import EquipmentRoutes from "./routes/EquipmentRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';

//configure environment
dotenv.config();

//database config
connectDB();

//esmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rest object
const app = express();

//middlewares
app.use(cors({
  origin: 'https://rich-gold-colt-boot.cyclic.app',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, './client/build')));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", CategoryRoutes);
app.use("/api/v1/products", CommodityRoutes);
app.use("/api/v1/equipment", EquipmentRoutes);
app.use("/api/v1/users", UserRoutes);

//serve static files
app.use('*', function(req, res){
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgCyan.white);
});


