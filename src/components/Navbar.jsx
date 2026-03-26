import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, PlusCircle, Home, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import './Navbar.css';

const Navbar = () => {
  const { cartItems } = useCart();
  const { favorites } = useFavorites();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar glass">
      <div className="nav-brand">
        <Link to="/">THRIFTLY</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-item"><Home size={20} /><span>Home</span></Link>
        <Link to="/sell" className="nav-item"><PlusCircle size={20} /><span>Sell</span></Link>
        
        <Link to="/favorites" className="nav-item nav-relative">
          <Heart size={20} />
          <span>Wishlist</span>
          {favorites.length > 0 && <span className="nav-badge">{favorites.length}</span>}
        </Link>
        
        <Link to="/cart" className="nav-item nav-relative">
          <ShoppingCart size={20} />
          <span>Cart</span>
          {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
        </Link>
        
        <Link to="/profile" className="nav-item"><User size={20} /><span>Profile</span></Link>
      </div>
    </nav>
  );
};

export default Navbar;
