import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle } from 'lucide-react';
import { formatPrice } from '../utils/priceUtils';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, 'Orders'), 
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  if (!currentUser) return <div className="no-info">Please login to view your orders.</div>;

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      {loading ? (
        <div className="loading">Fetching your history...</div>
      ) : orders.length === 0 ? (
        <div className="no-results">You haven't placed any orders yet.</div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-img">
                <img src={order.imageUrl} alt={order.productName} />
              </div>
              <div className="order-details">
                <h3>{order.productName}</h3>
                <p className="order-price">{formatPrice(order.price)}</p>
                <div className="order-meta">
                  <span>Ordered on: {order.createdAt?.toDate().toLocaleDateString()}</span>
                  <div className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status === 'Placed' ? <Clock size={14} /> : <CheckCircle size={14} />}
                    {order.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
