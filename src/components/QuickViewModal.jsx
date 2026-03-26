import React from 'react';
import { ShoppingCart, Heart, CreditCard, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/priceUtils';
import './QuickViewModal.css';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);
    addToast('Added to cart!');
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
    addToast(isFavorite(product.id) ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleProcessPayment = () => {
    addToCart(product);
    navigate('/checkout');
    onClose();
  };

  return (
    <div className="quick-view-container">
      <div className="quick-view-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      
      <div className="quick-view-details">
        <div className="qv-header">
          <span className="qv-brand">{product.brand}</span>
          <h2>{product.name}</h2>
          <div className="qv-price">{formatPrice(product.price)}</div>
        </div>
        
        <p className="qv-description">{product.description || 'Premium sneakers with exceptional comfort and timeless style. Ideal for both athletic performance and casual wear.'}</p>
        
        <div className="qv-meta">
          <div className="qv-meta-item">
            <label>Condition</label>
            <span>{product.condition || 'New'}</span>
          </div>
          <div className="qv-meta-item">
            <label>Size (US)</label>
            <span>{product.size || '10'}</span>
          </div>
        </div>
        
        <div className="qv-actions">
          <button className="btn btn-primary qv-btn" onClick={handleAddToCart}>
            <ShoppingCart size={18} /> Add to Cart
          </button>
          
          <button className="btn btn-outline qv-btn" onClick={handleToggleFavorite}>
            <Heart size={18} fill={isFavorite(product.id) ? "currentColor" : "none"} />
            {isFavorite(product.id) ? 'Favorited' : 'Add to Favorites'}
          </button>
          
          <button className="btn btn-accent qv-btn buy-now" onClick={handleProcessPayment}>
            <CreditCard size={18} /> Pay Now
          </button>
          
          <button className="btn btn-outline qv-btn icon-only" onClick={handleAddToCart} title="Move to Cart">
             <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
