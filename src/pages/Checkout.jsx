import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Truck, Store, CreditCard, ChevronLeft, CheckCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/priceUtils';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [deliveryType, setDeliveryType] = useState('home');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'Orders'), {
        userId: currentUser.uid,
        items: cartItems,
        totalPrice: subtotal,
        deliveryType,
        status: 'Placed',
        createdAt: serverTimestamp()
      });
      setStep(3); // Success step
      clearCart();
    } catch (err) {
      alert('Error placing order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="checkout-success page-enter">
        <div className="success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping with Thriftly. Your sneakers are on the way.</p>
        <div className="delivery-summary">
           <span>Delivery Mode: <b>{deliveryType === 'home' ? 'Home Delivery 🚚' : 'Store Pickup 🏬'}</b></span>
        </div>
        <button onClick={() => navigate('/orders')} className="btn btn-primary">View My Orders</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <button onClick={() => setStep(prev => Math.max(1, prev - 1))} className="back-btn">
        <ChevronLeft size={20} /> Back
      </button>

      <div className="checkout-layout">
        <div className="checkout-main">
          {step === 1 && (
            <div className="checkout-step page-enter">
              <h2>Select Delivery Method</h2>
              <div className="delivery-options">
                <div 
                  className={`delivery-card ${deliveryType === 'home' ? 'active' : ''}`}
                  onClick={() => setDeliveryType('home')}
                >
                  <Truck size={32} />
                  <div>
                    <h4>Home Delivery</h4>
                    <p>Delivered to your doorstep in 3-5 days.</p>
                  </div>
                  <div className="radio-circle"></div>
                </div>
                
                <div 
                  className={`delivery-card ${deliveryType === 'store' ? 'active' : ''}`}
                  onClick={() => setDeliveryType('store')}
                >
                  <Store size={32} />
                  <div>
                    <h4>Store Pickup</h4>
                    <p>Collect from your nearest Thriftly store.</p>
                  </div>
                  <div className="radio-circle"></div>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="btn btn-primary next-btn">Continue to Payment</button>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-step page-enter">
              <h2>Payment Information</h2>
              <div className="mock-payment">
                <div className="payment-header">
                  <CreditCard size={24} />
                  <span>Secure Mock Payment</span>
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" placeholder="**** **** **** 4242" disabled />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry</label>
                    <input type="text" placeholder="MM/YY" disabled />
                  </div>
                  <div className="form-group">
                    <label>CVC</label>
                    <input type="text" placeholder="***" disabled />
                  </div>
                </div>
                <p className="payment-note">This is a simulation. No real charges will be made.</p>
              </div>
              <button onClick={handlePlaceOrder} className="btn btn-primary next-btn" disabled={loading}>
                {loading ? 'Processing...' : `Pay ${formatPrice(subtotal)}`}
              </button>
            </div>
          )}
        </div>

        <div className="checkout-summary">
          <h3>Your Order</h3>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.imageUrl} alt={item.name} />
                <div className="sum-details">
                  <p>{item.name}</p>
                  <span>Qty: {item.quantity}</span>
                </div>
                <span className="sum-price">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="summary-footer">
            <div className="sum-row">
              <span>Delivery</span>
              <span>{deliveryType === 'home' ? 'Free' : 'Free'}</span>
            </div>
            <div className="sum-row total">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
