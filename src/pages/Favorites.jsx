import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { HeartOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Favorites.css';

const Favorites = () => {
  const { favorites } = useFavorites();
  const { addToCart } = useCart();

  if (favorites.length === 0) {
    return (
      <div className="empty-state">
        <HeartOff size={60} />
        <h2>Your wishlist is empty</h2>
        <p>Save your favorite sneakers for later!</p>
        <Link to="/" className="btn btn-primary">Discover Shoes</Link>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="title-row">
         <h1>Your Favorites</h1>
         <p>{favorites.length} items saved</p>
      </div>
      
      <div className="product-grid">
        {favorites.map(product => (
          <div key={product.id} className="fav-item-container">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
