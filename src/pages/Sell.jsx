import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import './Sell.css';

const Sell = () => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('New');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState('Sneakers');
  // Seller Details
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Please login to sell');
      return;
    }

    // Strict Validation
    if (!name.trim()) return setError('Please enter shoe name');
    if (!brand.trim()) return setError('Please enter brand name');
    const parsedPrice = parseFloat(price);
    if (!parsedPrice || parsedPrice <= 0 || isNaN(parsedPrice)) return setError('Price is required and must be a valid number');
    if (!size.trim()) return setError('Size is required');
    if (!image) return setError('Image upload is mandatory');
    if (!description.trim()) return setError('Please provide a description');
    if (!contactName.trim()) return setError('Please enter contact name for the seller');
    if (!contactPhone.trim()) return setError('Please enter your contact phone');
    if (!contactAddress.trim()) return setError('Please enter the pickup/contact address');
    
    setLoading(true);
    try {
      console.log("Starting upload for:", image.name);
      // 1. Upload Image (Safely sanitize name)
      const fileExt = image.name.split('.').pop() || 'jpg';
      const safeName = `${Date.now()}_img.${fileExt}`;
      const storageRef = ref(storage, `products/${safeName}`);
      const uploadResult = await uploadBytes(storageRef, image);
      console.log("Upload successful:", uploadResult);
      const imageUrl = await getDownloadURL(storageRef);
      console.log("Got download URL:", imageUrl);

      // 2. Save to Firestore
      const docData = {
        name,
        brand,
        price: parsedPrice,
        size,
        category,
        condition,
        description,
        imageUrl,
        sellerId: currentUser.uid,
        sellerName: userData?.name || currentUser.displayName || 'Anonymous',
        sellerEmail: currentUser.email || 'No Email',
        sellerContactName: contactName,
        sellerPhone: contactPhone,
        sellerAddress: contactAddress,
        createdAt: serverTimestamp()
      };
      
      console.log("Saving to Firestore:", docData);
      await addDoc(collection(db, 'Products'), docData);
      console.log("Saved to Firestore successfully");

      alert('Shoe listed successfully! Redirecting to Home...');
      navigate('/');
    } catch (err) {
      console.error("Sell Error:", err);
      if (err.code === 'storage/unauthorized') {
        setError('Storage Error: Unauthorized. Please check Firebase rules.');
      } else {
        setError('Error uploading product: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sell-page">
      <div className="sell-card">
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="image-upload">
            {imagePreview ? (
              <div className="preview-container">
                <img src={imagePreview} alt="Preview" />
                <button type="button" onClick={() => {setImage(null); setImagePreview(null);}} className="remove-img">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="upload-label">
                <Upload size={40} />
                <span>Upload Shoe Photo (Mandatory)</span>
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Model Name *</label>
              <input type="text" value={name} onChange={(e) => {setName(e.target.value); setError('');}} placeholder="e.g. Air Jordan 1" />
            </div>
            <div className="form-group">
              <label>Brand *</label>
              <input type="text" value={brand} onChange={(e) => {setBrand(e.target.value); setError('');}} placeholder="e.g. Nike" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (USD) *</label>
              <input type="number" value={price} onChange={(e) => {setPrice(e.target.value); setError('');}} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Size (US) *</label>
              <input type="text" value={size} onChange={(e) => {setSize(e.target.value); setError('');}} placeholder="e.g. 10.5" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Sneakers">Sneakers</option>
                <option value="Running">Running</option>
                <option value="Basketball">Basketball</option>
                <option value="Formal">Formal</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                <option value="New">New / Deadstock</option>
                <option value="Like New">Used - Like New</option>
                <option value="Good">Used - Good</option>
                <option value="Fair">Used - Fair</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea value={description} onChange={(e) => {setDescription(e.target.value); setError('');}} placeholder="Describe the condition, box, etc." rows="4"></textarea>
          </div>

          <div className="seller-details-section">
            <h3 className="section-heading">Seller Details (Mandatory)</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Name *</label>
                <input type="text" value={contactName} onChange={(e) => {setContactName(e.target.value); setError('');}} placeholder="E.g. John Doe" />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" value={contactPhone} onChange={(e) => {setContactPhone(e.target.value); setError('');}} placeholder="E.g. +1 234 567 890" />
              </div>
            </div>
            <div className="form-group">
              <label>Pickup / Contact Address *</label>
              <textarea value={contactAddress} onChange={(e) => {setContactAddress(e.target.value); setError('');}} placeholder="Enter the full address here" rows="2"></textarea>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Listing Product...' : 'List Shoes for Sale'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sell;
