import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RP6ojPP2Z8alkuteclLPAP5r47EozQbOYgwKfcJQr5zmEBsTfuTviQxubrXOca7XKg0oBM0T8TwivQRq3ytmodV00KM3FyHeN'); // Use environment variable for the publishable key

export const handleStripePayment = async (orderSummary) => {
  try {
    const stripe = await stripePromise;

    // Send a request to your backend to create a checkout session
    const response = await fetch('http://localhost:5000/api/payment/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: orderSummary.items }),
    });

    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      alert(result.error.message);
    }
  } catch (error) {
    console.error('Error during Stripe payment:', error.message);
    alert('Failed to initiate payment. Please try again.');
  }
};