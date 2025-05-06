import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import checkoutRouter from "./routes/checkout.routes.js";
const PORT = process.env.PORT;

app.use(express.json());

// connect mongodb
connectDB();

//Route
app.use("/api/auth", userRouter);
app.use("/api/products", productRoutes);
app.use("/api/", cartRoutes);
app.use("/api/", checkoutRouter);

app.listen(PORT, () => console.log(`server is running on localhost:${PORT}`));
