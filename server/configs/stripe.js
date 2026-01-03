import Stripe from "stripe";
import "dotenv/config";

let stripe;

if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn('⚠️ Warning: STRIPE_SECRET_KEY not found in environment variables. Stripe functionality will be disabled.');
    stripe = null;
}

export default stripe;
