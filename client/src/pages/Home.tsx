import React, { useState, useEffect } from 'react';
import { profilesAPI, matchesAPI } from '../services/api';
import ProfileCard from '../components/cards/ProfileCard';
import { useSocket } from '../contexts/SocketContext';

interface Profile {
  id: string;
  userId?: string;
  name: string;
  age?: number;
  bio?: string;
  dateOfBirth?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  photos?: {
    id: string;
    url: string;
    isMain: boolean;
  }[];
  interests?: {
    id: string;
    name: string;
  }[];
  lastActive?: string;
}

const Home: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkUserOnlineStatus } = useSocket();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await profilesAPI.getProfiles();
        console.log('Profiles response:', response);

        // Handle different response structures
        if (Array.isArray(response.data)) {
          setProfiles(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setProfiles(response.data.data);
        } else if (response.data && response.data.profiles && Array.isArray(response.data.profiles)) {
          setProfiles(response.data.profiles);
        } else {
          console.warn('Unexpected profiles response format:', response.data);
          setProfiles([]);
        }

        setError(null);
      } catch (err: any) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleLike = async (profileId: string) => {
    try {
      await matchesAPI.likeProfile(profileId);
      // Remove the profile from the list
      setProfiles(profiles.filter(profile => profile.id !== profileId));
    } catch (err) {
      console.error('Error liking profile:', err);
    }
  };

  const handlePass = async (profileId: string) => {
    try {
      await matchesAPI.passProfile(profileId);
      // Remove the profile from the list
      setProfiles(profiles.filter(profile => profile.id !== profileId));
    } catch (err) {
      console.error('Error passing profile:', err);
    }
  };

  // Calculate distance function (simplified)
  const calculateDistance = (profile: Profile): string | undefined => {
    if (!profile.location) return undefined;
    // This would normally calculate actual distance based on user's location
    // For now, return a random distance for demonstration
    const distances = ['2 miles', '5 miles', '10 miles', 'Less than a mile', '20 miles'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  return (
    <div className="px-4 pb-16 mx-auto max-w-6xl sm:pb-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="py-2 text-3xl font-bold text-primary-600 dark:text-primary-500">Discover Mengoers</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Find your perfect connection</p>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 bg-gray-100 rounded-full transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          <button className="p-2 bg-gray-100 rounded-full transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 bg-gray-50 rounded-2xl shadow-sm dark:bg-gray-800/30">
          <div className="mb-4 w-16 h-16 rounded-full animate-spin border-t-3 border-b-3 border-primary-500"></div>
          <p className="font-medium text-gray-600 dark:text-gray-400">Finding matches for you...</p>
        </div>
      ) : error ? (
        <div className="flex items-center p-6 text-red-700 bg-red-100 rounded-xl shadow-sm dark:bg-red-900/30 dark:text-red-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      ) : profiles.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-2xl shadow-sm dark:bg-gray-800/30">
          <div className="mb-6 text-6xl">😢</div>
          <h3 className="mb-3 text-2xl font-medium text-gray-900 dark:text-white">No more profiles</h3>
          <p className="mx-auto max-w-md text-gray-600 dark:text-gray-400">
            Check back later for new matches or adjust your preferences to see more people.
          </p>
          <button className="px-6 py-3 mt-6 font-medium text-white rounded-full transition-colors bg-primary-500 hover:bg-primary-600">
            Adjust Preferences
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => {
            // Calculate age from dateOfBirth if available
            let age = profile.age;
            if (!age && profile.dateOfBirth) {
              const birthDate = new Date(profile.dateOfBirth);
              const today = new Date();
              age = today.getFullYear() - birthDate.getFullYear();
              const m = today.getMonth() - birthDate.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
            }

            // Ensure photos array exists
            const photos = profile.photos || [];

            // Ensure interests array exists
            const interests = profile.interests || [];

            return (
              <ProfileCard
                key={profile.id}
                id={profile.id}
                name={profile.name || 'Unknown'}
                age={age || 25} // Default age if not available
                bio={profile.bio}
                distance={calculateDistance(profile)}
                photos={photos}
                interests={interests}
                isOnline={checkUserOnlineStatus(profile.userId || profile.id)}
                onLike={handleLike}
                onPass={handlePass}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
