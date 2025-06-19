import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import MessageThread from '../components/chat/MessageThread';

interface Conversation {
  matchId: string;
  userId: string;
  name: string;
  photoUrl?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const { socket, isConnected, checkUserOnlineStatus } = useSocket();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/matches', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Transform matches into conversations
        const matchesData = response.data.data;
        // Check if matchesData is an array
        if (!Array.isArray(matchesData)) {
          console.error('Expected array from matches API but got:', matchesData);
          setConversations([]);
          setLoading(false);
          return;
        }
        const conversationsData: Conversation[] = matchesData.map(match => {
          // Determine if the current user is user1 or user2
          const isCurrentUserInitiator = match.userId === user?.id;
          const otherUserId = isCurrentUserInitiator ? match.matchedUserId : match.userId;
          const otherUser = isCurrentUserInitiator ? match.user : match.user;

          return {
            matchId: match.id,
            userId: otherUserId,
            name: otherUser.name,
            photoUrl: otherUser.photos.find((p: any) => p.isMain)?.url,
            unreadCount: 0 // This would come from your API in a real app
          };
        });

        setConversations(conversationsData);

        // Select the first conversation by default if available
        if (conversationsData.length > 0 && !selectedConversation) {
          setSelectedConversation(conversationsData[0]);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [token, user?.id]);

  // Listen for new messages
  useEffect(() => {
    if (socket && isConnected) {
      socket.on('newMessage', (message: any) => {
        // Update unread count for the conversation
        setConversations(prevConversations =>
          prevConversations.map(conv => {
            if (conv.userId === message.senderId && selectedConversation?.userId !== message.senderId) {
              return { ...conv, unreadCount: conv.unreadCount + 1 };
            }
            return conv;
          })
        );
      });
    }

    return () => {
      if (socket) {
        socket.off('newMessage');
      }
    };
  }, [socket, isConnected, selectedConversation]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);

    // Reset unread count
    setConversations(prevConversations =>
      prevConversations.map(conv => {
        if (conv.matchId === conversation.matchId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      })
    );
  };

  return (
    <div className="h-[calc(100vh-10rem)] sm:h-[calc(100vh-8rem)] flex flex-col sm:flex-row rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow">
      {/* Conversations List */}
      <div className={`w-full sm:w-80 border-r dark:border-gray-700 ${selectedConversation ? 'hidden sm:block' : 'block'}`}>
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Messages</h2>
        </div>

        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-8 h-8 rounded-full border-t-2 border-b-2 animate-spin border-primary-500"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No conversations yet. Start matching with people!
            </div>
          ) : (
            <div>
              {conversations.map((conversation) => {
                const isOnline = checkUserOnlineStatus(conversation.userId);
                return (
                  <button
                    key={conversation.matchId}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedConversation?.matchId === conversation.matchId
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : ''
                      }`}
                  >
                    <div className="relative">
                      <div className="overflow-hidden w-12 h-12 bg-gray-300 rounded-full dark:bg-gray-600">
                        {conversation.photoUrl ? (
                          <img
                            src={conversation.photoUrl}
                            alt={conversation.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex justify-center items-center w-full h-full text-gray-600 dark:text-gray-300">
                            {conversation.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      {isOnline && (
                        <div className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                      {conversation.unreadCount > 0 && (
                        <div className="flex absolute top-0 right-0 justify-center items-center w-5 h-5 rounded-full bg-primary-500">
                          <span className="text-xs font-medium text-white">
                            {conversation.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow ml-3 text-left">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {conversation.name}
                        </h3>
                        {conversation.lastMessageTime && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(conversation.lastMessageTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {conversation.lastMessage || 'Start a conversation'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className={`flex-grow ${selectedConversation ? 'block' : 'hidden sm:flex sm:items-center sm:justify-center'}`}>
        {selectedConversation ? (
          <MessageThread
            matchId={selectedConversation.matchId}
            recipientId={selectedConversation.userId}
            recipientName={selectedConversation.name}
            recipientPhoto={selectedConversation.photoUrl}
          />
        ) : (
          <div className="p-8 text-center">
            <div className="mb-4 text-5xl">💬</div>
            <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
              Select a conversation
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        )}
      </div>

      {/* Mobile Back Button */}
      {selectedConversation && (
        <div className="fixed left-4 bottom-20 sm:hidden">
          <button
            onClick={() => setSelectedConversation(null)}
            className="p-3 bg-white rounded-full shadow-lg dark:bg-gray-800"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Messages;
