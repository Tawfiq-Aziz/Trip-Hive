import stripe from "stripe";

export const stripeWebhook = async (request, response) => {
   const stripeInstance = new stripe (process.env.STRIP_SECRET_KEY);
   const sig = request.headers['stripe-signature'];
   let event;

   try {
       event = stripeInstance.webhooks.constructEvent(request.rawBody, sig, process.env.STRIP_WEBHOOK_SECRET);
   } catch (error) {
      response.status(400).send(`Webhook Error: ${error.message}`);
   }

   if(event.type == "payment_intent.succeeded"){
       const paymentIntent = event.data.object;
       const paymentIntentId = paymentIntent.id;  

       const session = await stripeInstance.checkout.sessions.list({payment_intent: paymentIntent.id});

       const {bookingID} = session.data[0].metadata;
       await Booking.findByIdAndUpdate(bookingID, {isPaid: true, paymentMethod: "Stripe"});
   }else{
         console.log(`Unhandled event type ${event.type}`);
   }
   response.json({received: true});
}