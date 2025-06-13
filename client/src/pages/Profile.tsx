import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PencilIcon, CameraIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

interface Interest {
  id: string;
  name: string;
}

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

interface Profile {
  id: string;
  userId: string;
  name: string;
  age: number;
  bio?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  photos: Photo[];
  interests: Interest[];
  lastActive?: string;
}

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { user, token, updateUserProfile } = useAuth();
  const { checkUserOnlineStatus } = useSocket();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [editedInterests, setEditedInterests] = useState<Interest[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const isOwnProfile = !userId || userId === user?.id;
  const isOnline = userId ? checkUserOnlineStatus(userId) : false;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const targetUserId = userId || user?.id;
        
        if (!targetUserId) {
          setError('User not found');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`/api/profiles/${targetUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProfile(response.data);
        setEditedBio(response.data.bio || '');
        setEditedInterests(response.data.interests || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, user?.id, token]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    try {
      const updatedProfile = {
        ...profile,
        bio: editedBio,
        interests: editedInterests
      };
      
      await axios.put(`/api/profiles`, updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setProfile(updatedProfile);
      setIsEditing(false);
      
      // Update user context if needed
      if (isOwnProfile && updateUserProfile) {
        updateUserProfile(updatedProfile);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    
    const interest = {
      id: `temp-${Date.now()}`,
      name: newInterest.trim()
    };
    
    setEditedInterests([...editedInterests, interest]);
    setNewInterest('');
  };

  const handleRemoveInterest = (id: string) => {
    setEditedInterests(editedInterests.filter(interest => interest.id !== id));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setUploadingPhoto(true);
      
      const formData = new FormData();
      formData.append('photo', files[0]);
      
      const response = await axios.post('/api/profiles/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      if (profile) {
        setProfile({
          ...profile,
          photos: [...profile.photos, response.data]
        });
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSetMainPhoto = async (photoId: string) => {
    try {
      await axios.put(`/api/profiles/photos/${photoId}/main`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (profile) {
        const updatedPhotos = profile.photos.map(photo => ({
          ...photo,
          isMain: photo.id === photoId
        }));
        
        setProfile({
          ...profile,
          photos: updatedPhotos
        });
      }
    } catch (err) {
      console.error('Error setting main photo:', err);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await axios.delete(`/api/profiles/photos/${photoId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (profile) {
        setProfile({
          ...profile,
          photos: profile.photos.filter(photo => photo.id !== photoId)
        });
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-md">
        {error || 'Profile not found'}
      </div>
    );
  }

  return (
    <div className="pb-16 sm:pb-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 sm:h-48 bg-gradient-to-r from-primary-500 to-primary-600"></div>
        
        {/* Profile Header */}
        <div className="px-4 sm:px-6 pb-5 relative">
          {/* Profile Photo */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
              {profile.photos.find(p => p.isMain)?.url ? (
                <img 
                  src={profile.photos.find(p => p.isMain)?.url} 
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-4xl font-light">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Online Status */}
            {isOnline && (
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </div>
          
          {/* Profile Info */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.name}, {profile.age}
              </h1>
              {profile.lastActive && !isOnline && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last active {new Date(profile.lastActive).toLocaleDateString()}
                </p>
              )}
            </div>
            
            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <PencilIcon className="w-4 h-4 mr-1" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="px-4 sm:px-6 pb-6">
          {/* Bio */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">About</h2>
            {isEditing ? (
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                placeholder="Write something about yourself..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                rows={4}
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                {profile.bio || (isOwnProfile ? 'Add a bio to tell people about yourself...' : 'No bio available')}
              </p>
            )}
          </div>
          
          {/* Interests */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Interests</h2>
            {isEditing ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editedInterests.map((interest) => (
                    <div 
                      key={interest.id}
                      className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                    >
                      <span className="text-sm text-gray-800 dark:text-gray-200">{interest.name}</span>
                      <button 
                        onClick={() => handleRemoveInterest(interest.id)}
                        className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest..."
                    className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={handleAddInterest}
                    className="px-3 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.interests.length > 0 ? (
                  profile.interests.map((interest) => (
                    <span
                      key={interest.id}
                      className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      {interest.name}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    {isOwnProfile ? 'Add some interests to help people get to know you' : 'No interests listed'}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Photos */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Photos</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {profile.photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img 
                    src={photo.url} 
                    alt={`${profile.name}'s photo`} 
                    className="w-full h-full object-cover"
                  />
                  
                  {isOwnProfile && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-2">
                      {!photo.isMain && (
                        <button
                          onClick={() => handleSetMainPhoto(photo.id)}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                        >
                          Set Main
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded"
                        disabled={photo.isMain}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  
                  {photo.isMain && (
                    <div className="absolute top-1 right-1 bg-primary-500 text-white text-xs px-1 rounded">
                      Main
                    </div>
                  )}
                </div>
              ))}
              
              {isOwnProfile && profile.photos.length < 6 && (
                <label className="aspect-square rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <CameraIcon className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">Add Photo</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                  />
                  {uploadingPhoto && (
                    <div className="mt-2 animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-500"></div>
                  )}
                </label>
              )}
            </div>
          </div>
          
          {/* Save Button */}
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
