import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProfileCard from '../components/cards/ProfileCard';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';

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
  photos: {
    id: string;
    url: string;
    isMain: boolean;
  }[];
  interests: {
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
  const { token } = useAuth();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/profiles', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfiles(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [token]);

  const handleLike = async (profileId: string) => {
    try {
      await axios.post(`/api/matches/like/${profileId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Remove the profile from the list
      setProfiles(profiles.filter(profile => profile.id !== profileId));
    } catch (err) {
      console.error('Error liking profile:', err);
    }
  };

  const handlePass = async (profileId: string) => {
    try {
      await axios.post(`/api/matches/pass/${profileId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
    <div className="pb-16 sm:pb-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Discover</h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profiles...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-md">
          {error}
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">😢</div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No more profiles</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for new matches or adjust your preferences.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              id={profile.id}
              name={profile.name}
              age={profile.age}
              bio={profile.bio}
              distance={calculateDistance(profile)}
              photos={profile.photos}
              interests={profile.interests}
              isOnline={checkUserOnlineStatus(profile.userId)}
              onLike={handleLike}
              onPass={handlePass}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
