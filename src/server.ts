import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import orderRoutes from "./routes/order";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import sequelize from "./config/database";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// serve static uploaded file via URL
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// register all routes into app
app.use('/order', orderRoutes);
app.use('/auth', authRoutes);
app.use('/product', productRoutes);


const port = process.env.PORT || 3000;

// Sinkronisasi dengan database (it also mean when there's update, sequelize will update it)
sequelize
  .sync({ alter: true }) // Gunakan `{ force: true }` jika ingin menghapus tabel lama setiap kali server dijalankan
  .then(() => {
    console.log("Database synced!");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.error("Database connection failed:", err));