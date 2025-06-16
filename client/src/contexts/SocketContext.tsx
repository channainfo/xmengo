import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Record<string, boolean>;
  joinMatchRoom: (matchId: string) => void;
  leaveMatchRoom: (matchId: string) => void;
  sendTypingStatus: (matchId: string, isTyping: boolean) => void;
  checkOnlineStatus: (userIds: string[]) => void;
  checkUserOnlineStatus: (userId: string) => boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const { token, user } = useAuth();

  // Initialize socket connection when token changes
  useEffect(() => {
    if (!token || !user) {
      // Disconnect socket if user is not authenticated
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection with the SERVER_URI from .env.example
    const serverUrl = import.meta.env.VITE_SERVER_URI || 'https://otgs-sso.ngrok.io';
    
    console.log('Attempting to connect to socket server at:', serverUrl);
    
    // In development mode, make WebSocket connection optional
    const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development';
    
    try {
      const socketInstance = io(serverUrl, {
        auth: { token },
        transports: ['websocket'],
        autoConnect: true,
        reconnectionAttempts: isDev ? 2 : 5, // Fewer attempts in dev mode
        timeout: isDev ? 5000 : 10000, // Shorter timeout in dev mode
      });

      // Set up event listeners
      socketInstance.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      socketInstance.on('userStatus', (data: { userId: string; isOnline: boolean }) => {
        setOnlineUsers(prev => ({
          ...prev,
          [data.userId]: data.isOnline
        }));
      });

      socketInstance.on('onlineUsers', (data: Record<string, boolean>) => {
        setOnlineUsers(data);
      });

      // Save socket instance
      setSocket(socketInstance);

      // Clean up on unmount
      return () => {
        socketInstance.disconnect();
      };
    } catch (error) {
      // Handle connection error gracefully
      console.error('Failed to initialize socket connection:', error);
      setIsConnected(false);
      
      // Return empty cleanup function
      return () => {};
    }
  }, [token, user]);

  // Join a match room for private messaging
  const joinMatchRoom = (matchId: string) => {
    if (socket && isConnected) {
      socket.emit('joinMatchRoom', { matchId });
    }
  };

  // Leave a match room
  const leaveMatchRoom = (matchId: string) => {
    if (socket && isConnected) {
      socket.emit('leaveMatchRoom', { matchId });
    }
  };

  // Send typing status to a match room
  const sendTypingStatus = (matchId: string, isTyping: boolean) => {
    if (socket && isConnected) {
      socket.emit('typing', { matchId, isTyping });
    }
  };

  // Check online status for multiple users
  const checkOnlineStatus = (userIds: string[]) => {
    if (socket && isConnected) {
      socket.emit('checkOnlineStatus', { userIds });
    }
  };

  // Check if a specific user is online
  const checkUserOnlineStatus = (userId: string): boolean => {
    return onlineUsers[userId] || false;
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    joinMatchRoom,
    leaveMatchRoom,
    sendTypingStatus,
    checkOnlineStatus,
    checkUserOnlineStatus
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

// Export as a named constant instead of a function declaration for better compatibility with Fast Refresh
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
