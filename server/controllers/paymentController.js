import stripe from "../configs/stripe.js";

export const createPaymentIntent = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ 
        message: "Payment service is not configured. Please add STRIPE_SECRET_KEY to environment variables." 
      });
    }

    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
