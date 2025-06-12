import React, { useState } from 'react';
import { useGetCurrentUserQuery, useUpdateProfileMutation, User } from '../api';

const Profile: React.FC = () => {
  const { data: user, isLoading, error } = useGetCurrentUserQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    gender: '',
    interestedIn: [] as string[],
    dateOfBirth: '',
    location: '',
  });

  const [activeTab, setActiveTab] = useState('info');
  const [photos, setPhotos] = useState<string[]>([]);
  const [newPhoto, setNewPhoto] = useState('');

  // Initialize form data when user data is loaded
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        gender: user.gender || '',
        interestedIn: user.interestedIn || [] as string[],
        dateOfBirth: user.dateOfBirth || '',
        location: user.location || '',
      });

      if (user.photos) {
        setPhotos(user.photos);
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Special handling for interestedIn as it's an array
    if (name === 'interestedIn') {
      const select = e.target as HTMLSelectElement;
      const selectedOptions = Array.from(select.selectedOptions).map(option => option.value);

      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create a properly typed update payload
      const updatePayload: Partial<User> = {
        ...formData,
        photos
      };

      await updateProfile(updatePayload).unwrap();
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const addPhoto = () => {
    if (newPhoto && !photos.includes(newPhoto)) {
      setPhotos([...photos, newPhoto]);
      setNewPhoto('');
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
        <h2 className="mb-4 text-2xl font-bold text-red-500">Error loading profile</h2>
        <p className="text-gray-600 dark:text-gray-300">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">Your Profile</h1>

      <div className="overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'info' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={() => setActiveTab('info')}
          >
            Personal Info
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'photos' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={() => setActiveTab('photos')}
          >
            Photos
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'preferences' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'info' && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-gray-700 dark:text-gray-300" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 dark:text-gray-300" htmlFor="dateOfBirth">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-gray-700 dark:text-gray-300" htmlFor="location">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="City, Country"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-opacity hover:opacity-90"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'photos' && (
            <div>
              <h3 className="mb-4 text-xl font-semibold">Your Photos</h3>

              <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-3 lg:grid-cols-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`User ${index + 1}`}
                      className="object-cover w-full h-40 rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 p-1 text-white bg-red-500 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}

                {photos.length < 6 && (
                  <div className="flex justify-center items-center h-40 rounded-lg border-2 border-gray-300 border-dashed dark:border-gray-600">
                    <div className="p-4 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="block mt-2 text-sm text-gray-500 dark:text-gray-400">Add Photo</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center mb-4 space-x-2">
                <input
                  type="text"
                  value={newPhoto}
                  onChange={(e) => setNewPhoto(e.target.value)}
                  placeholder="Enter photo URL"
                  className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  onClick={addPhoto}
                  className="px-4 py-2 text-white bg-purple-600 rounded-lg transition-colors hover:bg-purple-700"
                  disabled={!newPhoto}
                >
                  Add
                </button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                You can add up to 6 photos. The first photo will be your profile picture.
              </p>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-opacity hover:opacity-90"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300" htmlFor="interestedIn">
                  Interested In
                </label>
                <select
                  id="interestedIn"
                  name="interestedIn"
                  multiple
                  value={formData.interestedIn}
                  onChange={handleInputChange}
                  className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  size={4}
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple options</p>
              </div>

              {/* Additional preference options can be added here */}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-opacity hover:opacity-90"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
