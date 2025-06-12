/**
 * API client for Fmengo dating app
 * This file contains the API client that will be used to communicate with the backend
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types for our API responses
export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  profilePicture?: string;
  photos?: string[];
  gender?: string;
  dateOfBirth?: string;
  location?: string;
  interestedIn?: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RecommendedUser {
  id: string;
  name: string;
  bio?: string;
  profilePicture?: string;
  photos: string[];
  age?: number;
  location?: string;
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  createdAt: string;
  matchedUser: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  messages: Message[];
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Like {
  id: string;
  userId: string;
  likedUserId: string;
  createdAt: string;
}

// Create the API client
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = (getState() as any).auth.token;
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation<AuthResponse, any>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation<AuthResponse, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    verifyEmail: builder.mutation<{ message: string }, { token: string }>({
      query: ({ token }) => ({
        url: `/auth/verify-email/${token}`,
        method: 'GET'
      }),
    }),
    googleLogin: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/google',
        method: 'GET'
      }),
    }),
    facebookLogin: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/facebook',
        method: 'GET'
      }),
    }),
    telegramLogin: builder.mutation<AuthResponse, any>({
      query: (telegramData) => ({
        url: '/auth/telegram',
        method: 'POST',
        body: telegramData,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
    }),
    
    // User profile endpoints
    getCurrentUser: builder.query<User, void>({
      query: () => '/users/me',
    }),
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: userData,
      }),
    }),
    uploadPhoto: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: '/users/photos',
        method: 'POST',
        body: formData,
      }),
    }),
    deletePhoto: builder.mutation<{ message: string }, { photoId: string }>({
      query: ({ photoId }) => ({
        url: `/users/photos/${photoId}`,
        method: 'DELETE',
      }),
    }),
    
    // Matching endpoints
    getRecommendedUsers: builder.query<RecommendedUser[], void>({
      query: () => '/users/recommendations',
      // Mock data for development without backend
      transformResponse: () => [
        {
          id: '1',
          name: 'Alex Johnson',
          bio: 'Love hiking and photography',
          profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
          photos: ['https://randomuser.me/api/portraits/men/32.jpg'],
          age: 28,
          location: 'New York, NY'
        },
        {
          id: '2',
          name: 'Sophia Williams',
          bio: 'Passionate about art and music',
          profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
          photos: ['https://randomuser.me/api/portraits/women/44.jpg'],
          age: 26,
          location: 'Los Angeles, CA'
        },
        {
          id: '3',
          name: 'Michael Brown',
          bio: 'Tech enthusiast and coffee lover',
          profilePicture: 'https://randomuser.me/api/portraits/men/67.jpg',
          photos: ['https://randomuser.me/api/portraits/men/67.jpg'],
          age: 31,
          location: 'Chicago, IL'
        },
        {
          id: '4',
          name: 'Emma Davis',
          bio: 'Travel addict and foodie',
          profilePicture: 'https://randomuser.me/api/portraits/women/22.jpg',
          photos: ['https://randomuser.me/api/portraits/women/22.jpg'],
          age: 24,
          location: 'Seattle, WA'
        },
        {
          id: '5',
          name: 'James Wilson',
          bio: 'Fitness enthusiast and dog lover',
          profilePicture: 'https://randomuser.me/api/portraits/men/45.jpg',
          photos: ['https://randomuser.me/api/portraits/men/45.jpg'],
          age: 29,
          location: 'Austin, TX'
        }
      ]
    }),
    likeUser: builder.mutation<{ match?: Match }, { userId: string }>({
      query: ({ userId }) => ({
        url: `/users/like/${userId}`,
        method: 'POST',
      }),
    }),
    dislikeUser: builder.mutation<{ message: string }, { userId: string }>({
      query: ({ userId }) => ({
        url: `/users/dislike/${userId}`,
        method: 'POST',
      }),
    }),
    getMatches: builder.query<Match[], void>({
      query: () => '/users/matches',
      // Mock data for development without backend
      transformResponse: () => [
        {
          id: '1',
          userId: 'current-user-id',
          matchedUserId: '2',
          createdAt: new Date().toISOString(),
          matchedUser: {
            id: '2',
            name: 'Sophia Williams',
            profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
          },
          messages: [
            {
              id: '1',
              matchId: '1',
              senderId: 'current-user-id',
              content: 'Hey there!',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              read: true
            },
            {
              id: '2',
              matchId: '1',
              senderId: '2',
              content: 'Hi! How are you?',
              timestamp: new Date(Date.now() - 3500000).toISOString(),
              read: true
            }
          ]
        },
        {
          id: '2',
          userId: 'current-user-id',
          matchedUserId: '4',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          matchedUser: {
            id: '4',
            name: 'Emma Davis',
            profilePicture: 'https://randomuser.me/api/portraits/women/22.jpg',
          },
          messages: []
        }
      ]
    }),
    
    // Messaging endpoints
    getMessages: builder.query<Message[], { matchId: string }>({
      query: ({ matchId }) => `/messages/${matchId}`,
      // Mock data for development without backend
      transformResponse: (response, meta, arg) => {
        // Use the arg parameter which contains the original arguments
        const matchId = arg?.matchId;
        
        if (matchId === '1') {
          return [
            {
              id: '1',
              matchId: '1',
              senderId: 'current-user-id',
              content: 'Hey there!',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              read: true
            },
            {
              id: '2',
              matchId: '1',
              senderId: '2',
              content: 'Hi! How are you?',
              timestamp: new Date(Date.now() - 3500000).toISOString(),
              read: true
            }
          ];
        }
        return [];
      }
    }),
    sendMessage: builder.mutation<Message, { matchId: string; content: string }>({
      query: ({ matchId, content }) => ({
        url: `/messages/${matchId}`,
        method: 'POST',
        body: { content },
      }),
      // Mock response for development without backend
      transformResponse: (response, meta, arg) => {
        // Use the arg parameter which contains the original arguments
        return {
          id: String(Date.now()),
          matchId: arg?.matchId || '',
          senderId: 'current-user-id',
          content: arg?.content || '',
          timestamp: new Date().toISOString(),
          read: false
        };
      }
    }),
  }),
});

// Export hooks for using the API
export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useGoogleLoginMutation,
  useFacebookLoginMutation,
  useTelegramLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUploadPhotoMutation,
  useDeletePhotoMutation,
  useGetRecommendedUsersQuery,
  useLikeUserMutation,
  useDislikeUserMutation,
  useGetMatchesQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = api;
