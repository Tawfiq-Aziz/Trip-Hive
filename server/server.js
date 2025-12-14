import express from 'express';
import "dotenv/config.js";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
import paymentRoutes from "./routes/paymentRoutes.js";//added_atripe


connectDB();

const app = express();
app.use(cors()); // Enable cross-origin resource sharing

//Middleware 
app.use(clerkMiddleware());
app.use(express.json()); 

//API TO LISTEN TO CLERK WEBHOOKS
app.use("/api/clerk", clerkWebhooks);

app.get('/', (req, res) => res.send('API IS WORKING'));

app.use("/api/payment", paymentRoutes);//added_stripe

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

