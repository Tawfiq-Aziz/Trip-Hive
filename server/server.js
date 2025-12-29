import express from 'express'; 
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';    
import paymentRoutes from "./routes/paymentRoutes.js"; // added_stripe
import sentimentRoutes from "./routes/sentimentRoutes.js"; // fixed path
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import reviewsRoute from "./routes/reviews.js";//✅ added

connectDB();
connectCloudinary();

const app = express();
app.use(cors()); // Enable cross-origin resource sharing

app.use(clerkMiddleware());
app.use(express.json());

app.use("/api/clerk", clerkWebhooks);

app.get('/', (req, res) => res.send('API IS WORKING'));

// Other routes
app.use("/api/user", userRouter );
app.use("/api/hotels", hotelRouter );
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payment", paymentRoutes);
app.use("/api/sentiment", sentimentRoutes);
app.use("/api/reviews", reviewsRoute);// ✅ added

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});






