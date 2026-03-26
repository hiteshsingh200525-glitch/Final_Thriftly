import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';
import { Search, Filter, Sparkles } from 'lucide-react';
import { dummyShoes } from '../data/shoes';
import './Home.css';

const Home = () => {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');

  useEffect(() => {
    // Remove orderBy to prevent Firebase index errors on new collections
    const q = query(collection(db, 'Products'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort locally by createdAt desc
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
        return timeB - timeA;
      });

      console.log("Real-time products updated:", data);
      setDbProducts(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching products:", err);
      // Fallback in case of error
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Combine DB products with premium dummy data
  const allProducts = [...dbProducts, ...dummyShoes];

  const brands = ['All', ...new Set(allProducts.map(p => p.brand))];

  const filteredProducts = allProducts.filter(p => {
    const pName = p.name || '';
    const pBrand = p.brand || '';
    const matchesSearch = pName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pBrand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'All' || p.brand === filterBrand;
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="home-page page-enter">
      <header className="hero-section">
        <div className="hero-content">
          <div className="badge"><Sparkles size={14} /> New Season Collection</div>
          <h1>Step into <br /><span>Style.</span></h1>
          <p>Discover the most exclusive and authentic second-hand sneakers from top brands globally.</p>
          <div className="hero-buttons">
             <button className="btn btn-primary" onClick={() => document.getElementById('market').scrollIntoView({behavior: 'smooth'})}>Shop Collection</button>
          </div>
        </div>
        <div className="hero-image">
           <img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1200" alt="Hero Shoe" />
        </div>
      </header>

      <section id="market" className="marketplace">
        <div className="market-header-premium">
           <h2>Explore Marketplace</h2>
           <p>Find your next grail among our authentic collection.</p>
           
           <div className="controls-glass">
              <div className="search-box">
                <Search size={20} color="var(--text-muted)" />
                <input 
                  type="text" 
                  placeholder="Search model, brand..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-divider"></div>
              <div className="filter-box">
                <Filter size={18} color="var(--text-muted)" />
                <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
                  {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>
           </div>
           
           <div className="brand-chips">
              {['All', 'Nike', 'Jordan', 'Adidas', 'New Balance'].map(brand => (
                <button 
                  key={brand} 
                  className={`chip ${filterBrand === brand ? 'active' : ''}`}
                  onClick={() => setFilterBrand(brand)}
                >
                  {brand}
                </button>
              ))}
           </div>
        </div>

        {loading && dbProducts.length === 0 && allProducts.length === 0 ? (
          <div className="loading-state">Updating collection...</div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        {filteredProducts.length === 0 && (
          <div className="no-results-state">
            <p>No products match your filters.</p>
            <button className="btn btn-outline" onClick={() => {setSearchTerm(''); setFilterBrand('All');}}>Clear All</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
