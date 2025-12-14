import express from 'express'; 
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebhooks.js';
import paymentRoutes from "./routes/paymentRoutes.js"; // added_stripe
import sentimentRoutes from "./routes/sentimentRoutes.js"; // fixed path

connectDB();

const app = express();
app.use(cors()); // Enable cross-origin resource sharing

app.use(clerkMiddleware());
app.use(express.json());

app.use("/api/clerk", clerkWebhooks);

app.get('/', (req, res) => res.send('API IS WORKING'));

// Other routes
app.use("/api/payment", paymentRoutes);
app.use("/api/sentiment", sentimentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





