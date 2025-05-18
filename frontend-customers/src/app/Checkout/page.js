'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/Header";
import { getUserDetails } from '@/services/userService'; 
import { updateUserAddress } from '@/services/orderService';
import { handleStripePayment } from '@/services/paymentService';
import { placeOrder } from '@/services/orderService';
import '@/styles/Checkout.css';

const Checkout = () => {
  // State for form data
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    MobileNumber: '',
    Street_No: '',
    Village: '',
    City: '',
    Postal_Code: '',
    paymentMethod: 'cod',
  });

  // State for any error messages
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  // State for order summary
  const [orderSummary, setOrderSummary] = useState({
    items: [],
    subtotal: 0,
    shipping: 300.00,
    total: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear any errors for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // Validate address
    if (!formData.Street_No.trim()) {
      newErrors.Street_No = 'Street Number is required';
    }

    if (!formData.Village.trim()) {
      newErrors.Village = 'Village is required';
    }

    if (!formData.City.trim()) {
      newErrors.City = 'City is required';
    }

    if (!formData.Postal_Code.trim()) {
      newErrors.Postal_Code = 'Postal Code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const addressData = {
          Street_No: formData.Street_No,
          Village: formData.Village,
          City: formData.City,
          Postal_Code: formData.Postal_Code,
        };
  
        console.log('Address Data:', addressData);
  
        await updateUserAddress(addressData);
        // Prepare the order data
        const orderData = {
          items: orderSummary.items.map((item) => ({
            productId: item.id,
            price: item.price,            
            quantity: item.quantity,
          })),
          totalAmount: orderSummary.total,
          paymentMethod: formData.paymentMethod,
        };
  
        // Place the order
        const response = await placeOrder(orderData);

        localStorage.setItem('orderId', response.orderId);
  
        router.push('/CodSuccessful'); // Redirect to order confirmation page
  
        if (formData.paymentMethod === 'stripe') {
          await handleStripePayment(orderSummary); // Use the payment service
        } else {
          console.log('COD order placed:', formData);
          alert('Order placed with Cash on Delivery!');
        }
      } catch (error) {
        console.error('Error placing order:', error.message);
        alert('Failed to place order. Please try again.');
      }
    } else {
      console.log('Form has errors');
    }
  };

  useEffect(() => {
    // Extract product data from query parameters
    const productId = searchParams.get('id');
    const productName = searchParams.get('name');
    const productPrice = parseFloat(searchParams.get('price')) || 0;
    const productQuantity = parseInt(searchParams.get('quantity')) || 1;

    if (productId && productName && productPrice) {
      const subtotal = productPrice * productQuantity;
      const total = subtotal + orderSummary.shipping;

      setOrderSummary({
        items: [
          {
            id: productId,
            name: productName,
            price: productPrice,
            quantity: productQuantity,
          },
        ],
        subtotal,
        shipping: orderSummary.shipping,
        total,
      });
    }
  }, [searchParams]);

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const userDetails = await getUserDetails(); // Fetch user details from the backend
        setFormData((prevFormData) => ({
          ...prevFormData,
          FirstName: userDetails.FirstName || '',
          LastName: userDetails.LastName || '',
          Email: userDetails.Email || '',
          MobileNumber: userDetails.MobileNumber || '',
          Street_No: userDetails.Street_No || '',
          Village: userDetails.Village || '',
          City: userDetails.City || '',
          Postal_Code: userDetails.Postal_Code || '',
        }));
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    // Retrieve cart items from local storage
    const storedCartItems = localStorage.getItem('cartItems');
    const cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];

    if (cartItems.length > 0) {
      const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      const total = subtotal + orderSummary.shipping;

      setOrderSummary({
        items: cartItems,
        subtotal,
        shipping: orderSummary.shipping,
        total,
      });
    }
  }, []);

  // Handle form field changes
  


  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="checkout-page">
      <Header isHomePage={true}/>
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-content">
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Customer Information Section */}
              <section className="checkout-section">
                <h2 className="section-title">Customer Information</h2>
                <div className="form-group">
                  <label htmlFor="Email">Email Address</label>
                  <input
                    type="email"
                    id="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    className={errors.Email ? 'input-error' : ''}
                    disabled // Email should not be editable
                  />
                  {errors.Email && <span className="error-message">{errors.Email}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="FirstName">First Name</label>
                    <input
                      type="text"
                      id="FirstName"
                      name="FirstName"
                      value={formData.FirstName}
                      onChange={handleChange}
                      className={errors.FirstName ? 'input-error' : ''}
                      disabled
                    />
                    {errors.FirstName && <span className="error-message">{errors.FirstName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="LastName">Last Name</label>
                    <input
                      type="text"
                      id="LastName"
                      name="LastName"
                      value={formData.LastName}
                      onChange={handleChange}
                      className={errors.LastName ? 'input-error' : ''}
                      disabled
                    />
                    {errors.LastName && <span className="error-message">{errors.LastName}</span>}
                  </div>
                </div>
              </section>

              {/* Shipping Address Section */}
              <section className="checkout-section">
                <h2 className="section-title">Shipping Address</h2>
                <div className="form-group">
                  <label htmlFor="Street_No">Street Number</label>
                  <input
                    type="text"
                    id="Street_No"
                    name="Street_No"
                    value={formData.Street_No}
                    onChange={handleChange}
                    className={errors.Street_No ? 'input-error' : ''}
                  />
                  {errors.Street_No && <span className="error-message">{errors.Street_No}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="Village">Village</label>
                    <input
                      type="text"
                      id="Village"
                      name="Village"
                      value={formData.Village}
                      onChange={handleChange}
                      className={errors.Village ? 'input-error' : ''}
                    />
                    {errors.Village && <span className="error-message">{errors.Village}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="City">City</label>
                    <input
                      type="text"
                      id="City"
                      name="City"
                      value={formData.City}
                      onChange={handleChange}
                      className={errors.City ? 'input-error' : ''}
                    />
                    {errors.City && <span className="error-message">{errors.City}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="Postal_Code">Postal Code</label>
                    <input
                      type="text"
                      id="Postal_Code"
                      name="Postal_Code"
                      value={formData.Postal_Code}
                      onChange={handleChange}
                      className={errors.Postal_Code ? 'input-error' : ''}
                    />
                    {errors.Postal_Code && <span className="error-message">{errors.Postal_Code}</span>}
                  </div>
                </div>
              </section>

              {/* Payment Method Section */}
              <section className="checkout-section">
                <h2 className="section-title">Payment Method</h2>
                <div className="payment-options">
                  <div className="payment-option">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <label htmlFor="cod" className="payment-label">Cash on Delivery</label>
                  </div>

                  <div className="payment-option">
                    <input
                      type="radio"
                      id="stripe"
                      name="paymentMethod"
                      value="stripe"
                      checked={formData.paymentMethod === 'stripe'}
                      onChange={handleChange}
                    />
                    <label htmlFor="stripe" className="payment-label">Stripe</label>
                  </div>
                </div>
              </section>

              <button type="submit" className="checkout-button">Place Order</button>
            </form>
          </div>
            <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {orderSummary.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-details">
                    <span className="item-quantity">{item.quantity} x</span>
                    <span className="item-name">{item.name}</span>
                  </div>
                  <span className="item-price">
                    Rs.{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>Rs.{orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>Rs.{orderSummary.shipping.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>Rs.{orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;