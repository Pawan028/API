const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const Razorpay = require('razorpay');
const uploadRoutes = require('./routes/uploadRoutes');
const locationRoutes = require('./routes/locationRoutes');
const statsRouter = require('./routes/stats');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', statsRouter);
app.use('/api/locations', locationRoutes);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

if (!process.env.VERCEL) {
  app.listen(port, () =>
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
  );
}
