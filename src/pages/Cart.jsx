import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../utils/priceUtils';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <ShoppingBag size={60} />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.imageUrl} alt={item.name} />
              </div>
              <div className="item-details">
                <div className="item-header">
                  <h3>{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="item-brand">{item.brand}</p>
                <p className="item-price">{formatPrice(item.price)}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn"><Minus size={14} /></button>
                  <span className="qty-val">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn btn-primary checkout-btn">
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
