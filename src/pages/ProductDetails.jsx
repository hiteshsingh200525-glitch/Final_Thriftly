import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Tag, Box, Star, MessageSquare } from 'lucide-react';
import { formatPrice } from '../utils/priceUtils';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      // Fetch Product
      const docRef = doc(db, 'Products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }

      // Fetch Reviews
      const q = query(collection(db, 'Reviews'), where('productId', '==', id));
      const reviewSnap = await getDocs(q);
      setReviews(reviewSnap.docs.map(d => d.data()));
      
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!currentUser) return navigate('/login');
    try {
      const newReview = {
        userId: currentUser.uid,
        userName: userData?.name || 'Anonymous',
        productId: id,
        rating,
        comment,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'Reviews'), newReview);
      setReviews([...reviews, newReview]);
      setComment('');
      alert('Review submitted!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleBuy = async () => {
    if (!currentUser) return navigate('/login');
    
    try {
      await addDoc(collection(db, 'Orders'), {
        userId: currentUser.uid,
        productId: product.id,
        productName: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        status: 'Placed',
        createdAt: serverTimestamp()
      });
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Error placing order: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteDoc(doc(db, 'Products', id));
        alert('Product deleted successfully');
        navigate('/');
      } catch (err) {
        alert('Error deleting: ' + err.message);
      }
    }
  };

  if (loading) return <div className="loading">Loading details...</div>;
  if (!product) return <div className="no-results">Product not found.</div>;

  return (
    <div className="details-page">
      <div className="details-grid">
        <div className="details-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="details-info">
          <span className="details-brand">{product.brand}</span>
          <h1 className="details-title">{product.name}</h1>
          <div className="details-price">{formatPrice(product.price)}</div>
          
          <div className="details-meta">
            <div className="meta-item"><Box size={18} /> <span>Condition: <b>{product.condition}</b></span></div>
            <div className="meta-item"><Tag size={18} /> <span>Size: <b>{product.size}</b></span></div>
            <div className="meta-item"><Star size={18} /> <span>Authentic Guaranteed</span></div>
          </div>

          <div className="details-desc">
            <h3>Description</h3>
            <p>{product.description || "No description provided for this pair of sneakers."}</p>
          </div>

          <div className="seller-info">
            <h3>Seller Information</h3>
            <p><strong>Name:</strong> <span>{product.sellerContactName || product.sellerName || 'Not Provided'}</span></p>
            <p><strong>Phone:</strong> <span>{product.sellerPhone || 'Not Provided'}</span></p>
            <p><strong>Address:</strong> <span>{product.sellerAddress || 'Not Provided'}</span></p>
          </div>

          <div className="action-buttons">
            <button onClick={handleBuy} className="btn-buy">
              <ShoppingBag size={20} />
              <span>Buy Now</span>
            </button>
            {currentUser?.uid === product.sellerId && (
              <button onClick={handleDelete} className="btn-delete">
                Delete Listing
              </button>
            )}
          </div>

          <div className="reviews-section">
            <h3>Reviews ({reviews.length})</h3>
            <div className="review-form">
              <h4>Write a Review</h4>
              <form onSubmit={handleReview}>
                <div className="rating-select">
                  <label>Rating: </label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <textarea 
                  placeholder="What did you think of these shoes?" 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <button type="submit">Submit Review</button>
              </form>
            </div>
            <div className="reviews-list">
              {reviews.map((r, i) => (
                <div key={i} className="review-item">
                  <div className="review-header">
                    <span className="reviewer">{r.userName}</span>
                    <span className="stars">{Array(r.rating).fill('★').join('')}</span>
                  </div>
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
