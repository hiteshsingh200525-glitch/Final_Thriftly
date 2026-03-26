import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LogOut, User as UserIcon, Mail, Calendar, Edit2, Camera, Loader2 } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { currentUser, userData, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData?.name || '');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `avatars/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      
      await updateDoc(doc(db, 'Users', currentUser.uid), {
        photoURL: photoURL
      });
      
      alert('Profile picture updated!');
    } catch (err) {
      console.error(err);
      alert('Error updating profile picture: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = () => {
    // Mock save
    setIsEditing(false);
    alert('Profile updated! (Simulation)');
  };

  if (!currentUser) return <div className="no-info">Please login to view your profile.</div>;

  return (
    <div className="profile-page page-enter">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar">
              {uploading ? (
                <Loader2 className="spinner" size={24} />
              ) : userData?.photoURL ? (
                <img src={userData.photoURL} alt="Avatar" className="avatar-img" />
              ) : (
                userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <label className="edit-avatar">
              <Camera size={16} />
              <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
            </label>
          </div>
          <h2>{userData?.name || 'User'}</h2>
          <p>{currentUser.email}</p>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <div className="info-content">
               <UserIcon size={18} />
               <div>
                 <label>Full Name</label>
                 {isEditing ? (
                   <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="edit-input" />
                 ) : (
                   <span>{name || userData?.name || 'Not provided'}</span>
                 )}
               </div>
            </div>
            <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="edit-btn">
              {isEditing ? 'Save' : <Edit2 size={16} />}
            </button>
          </div>
          
          <div className="info-item">
            <div className="info-content">
               <Mail size={18} />
               <div>
                 <label>Email Address</label>
                 <span>{currentUser.email}</span>
               </div>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-content">
               <Calendar size={18} />
               <div>
                 <label>Member Since</label>
                 <span>{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Recently'}</span>
               </div>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
