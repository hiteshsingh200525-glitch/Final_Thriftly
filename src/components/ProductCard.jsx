import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Expand } from 'lucide-react';
import { useCart as useCartState } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import Modal from './Modal';
import QuickViewModal from './QuickViewModal';
import { formatPrice } from '../utils/priceUtils';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartState();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToast } = useToast();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const beingFavorited = !isFavorite(product.id);
    toggleFavorite(product);
    addToast(beingFavorited ? 'Added to Wishlist' : 'Removed from Wishlist');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    addToast('Item added to cart!');
  };

  const openQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="product-card group">
        <Link to={`/product/${product.id}`} className="card-link">
          <div className="product-image-container">
            <img src={product.imageUrl} alt={product.name} className="product-image" loading="lazy" />
            
            <div className="action-bar-container">
              <div className="action-bar">
                <button 
                  onClick={handleFavorite} 
                  className={`bar-icon-btn ${isFavorite(product.id) ? 'active' : ''}`}
                  title="Add to Wishlist"
                >
                  <Heart size={18} fill={isFavorite(product.id) ? "white" : "none"} />
                </button>
                <div className="bar-divider"></div>
                <button onClick={openQuickView} className="bar-quick-view">
                  Quick View
                </button>
                <div className="bar-divider"></div>
                <button onClick={handleAddToCart} className="bar-icon-btn" title="Add to Cart">
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="product-details">
            <h3 className="name">{product.brand} {product.name}</h3>
            <div className="price">{formatPrice(product.price)}</div>
          </div>
        </Link>
      </div>

      <Modal isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)}>
        <QuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />
      </Modal>
    </>
  );
};

export default ProductCard;
