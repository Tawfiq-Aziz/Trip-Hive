import StripeWrapper from "../stripe/StripeWrapper";
import CheckoutForm from "../stripe/CheckoutForm";

const Checkout = () => {
  return (
    <StripeWrapper>
      <CheckoutForm amount={100} />
    </StripeWrapper>
  );
};

export default Checkout;
