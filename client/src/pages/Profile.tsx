import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PencilIcon, CameraIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import ProfileCard from '@/components/ProfileCard';

export interface Interest {
  id: string;
  name: string;
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

export interface Profile {
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
  const { user, token } = useAuth();
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
        // Handle both response structures - either direct data or nested in data property
        const responseProfile = response.data.data || response.data;
        console.log("setProfile:=======================", responseProfile);

        if (!responseProfile) {
          setError('Profile data not found');
          setLoading(false);
          return;
        }

        setProfile(responseProfile);
        setEditedBio(responseProfile.bio || '');
        setEditedInterests(responseProfile.interests || []);
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
      // Only send allowed fields according to UpdateProfileDto
      // The server expects interests as string names, not objects
      const updateData = {
        bio: editedBio,
        // Extract just the interest names as strings
        interests: editedInterests.map(interest => interest.name)
      };

      console.log('Sending profile update:', updateData);
      
      const response = await axios.patch(`/api/profiles`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Profile update response:', response.data);
      
      // Update local profile state with the new data
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          bio: editedBio,
          interests: editedInterests
        };
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;

    // Create a new interest object with a temporary ID
    const interest: Interest = {
      id: `temp-${Date.now()}`,
      name: newInterest.trim()
    };

    // Check if this interest already exists to avoid duplicates
    const exists = editedInterests.some(i => 
      i.name.toLowerCase() === interest.name.toLowerCase()
    );
    
    if (!exists) {
      setEditedInterests([...editedInterests, interest]);
    }
    
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
      
      // For development, we'll use a placeholder URL based on the file name
      // In production, you would upload to a storage service first, then send the URL
      const file = files[0];
      const fileName = file.name;
      
      // Create a placeholder URL for development purposes
      // This simulates having uploaded the image to a cloud storage
      const placeholderUrl = `https://placeholder-storage.com/photos/${fileName}`;
      
      console.log('Sending photo data with URL:', placeholderUrl);
      
      // Send the URL to the server as expected by the API
      const response = await axios.post('/api/profiles/photos', {
        url: placeholderUrl,
        isMain: profile?.photos.length === 0 // Make it main if it's the first photo
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Photo upload response:', response.data);
      
      if (profile) {
        const newPhoto = response.data.data || response.data;
        setProfile({
          ...profile,
          photos: [...profile.photos, newPhoto]
        });
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSetMainPhoto = async (photoId: string) => {
    try {
      // Use POST method as specified in the server controller
      await axios.post(`/api/profiles/photos/${photoId}/main`, {}, {
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
      <div className="flex flex-col justify-center items-center py-12">
        <div className="mb-4 w-12 h-12 rounded-full border-t-2 border-b-2 animate-spin border-primary-500"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-300">
        {error || 'Profile not found'}
      </div>
    );
  }

  return (
    <div className="pb-16 sm:pb-0">
      <div className="overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r sm:h-48 from-primary-500 to-primary-600"></div>

        {/* Profile Header */}
        <div className="relative px-4 pb-5 sm:px-6">
          {/* Profile Photo */}
          <div className="relative -mt-16 mb-4">
            <div className="overflow-hidden w-32 h-32 bg-gray-200 rounded-full border-4 border-white dark:border-gray-800 dark:bg-gray-700">
              {profile.photos && profile.photos.length > 0 && profile.photos.find(p => p.isMain)?.url ? (
                <img
                  src={profile.photos?.find(p => p.isMain)?.url}
                  alt={profile.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex justify-center items-center w-full h-full text-4xl font-light text-gray-400 dark:text-gray-500">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Online Status */}
            {isOnline && (
              <div className="absolute right-2 bottom-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
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
                className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <PencilIcon className="mr-1 w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-4 pb-6 sm:px-6">
          {/* Bio */}
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">About</h2>
            {isEditing ? (
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                placeholder="Write something about yourself..."
                className="p-3 w-full text-gray-900 bg-white rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
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
            <h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Interests</h2>
            {isEditing ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editedInterests.map((interest) => (
                    <div
                      key={interest.id}
                      className="flex items-center px-3 py-1 bg-gray-100 rounded-full dark:bg-gray-700"
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
                    className="flex-grow p-2 text-gray-900 bg-white rounded-l-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={handleAddInterest}
                    className="px-3 py-2 text-white rounded-r-md bg-primary-600 hover:bg-primary-700"
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
                      className="px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-200"
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
            <h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Photos</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {profile.photos.map((photo) => (
                <div key={photo.id} className="overflow-hidden relative bg-gray-200 rounded-md aspect-square dark:bg-gray-700">
                  <img
                    src={photo.url}
                    alt={`${profile.name}'s photo`}
                    className="object-cover w-full h-full"
                  />

                  {isOwnProfile && (
                    <div className="flex absolute inset-0 flex-col justify-center items-center space-y-2 opacity-0 transition-opacity bg-black/40 hover:opacity-100">
                      {!photo.isMain && (
                        <button
                          onClick={() => handleSetMainPhoto(photo.id)}
                          className="px-2 py-1 text-xs text-white bg-blue-600 rounded"
                        >
                          Set Main
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="px-2 py-1 text-xs text-white bg-red-600 rounded"
                        disabled={photo.isMain}
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {photo.isMain && (
                    <div className="absolute top-1 right-1 px-1 text-xs text-white rounded bg-primary-500">
                      Main
                    </div>
                  )}
                </div>
              ))}

              {isOwnProfile && profile.photos.length < 6 && (
                <label className="flex flex-col justify-center items-center rounded-md border-2 border-gray-300 border-dashed cursor-pointer aspect-square dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
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
                    <div className="mt-2 w-5 h-5 rounded-full border-t-2 border-b-2 animate-spin border-primary-500"></div>
                  )}
                </label>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Galleries</h2>
            <ProfileCard user={profile} />
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 text-white rounded-md bg-primary-600 hover:bg-primary-700"
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
