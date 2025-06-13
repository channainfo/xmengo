import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  isRead: boolean;
}

interface MessageThreadProps {
  matchId: string;
  recipientId: string;
  recipientName: string;
  recipientPhoto?: string;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  matchId,
  recipientId,
  recipientName,
  recipientPhoto
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const { user } = useAuth();
  const { socket, isConnected, checkUserOnlineStatus } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isOnline = checkUserOnlineStatus(recipientId);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch messages from your API
        // For now, we'll simulate a delay and use mock data
        setTimeout(() => {
          const mockMessages: Message[] = [
            {
              id: '1',
              content: 'Hey there!',
              senderId: recipientId,
              receiverId: user?.id || '',
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              isRead: true
            },
            {
              id: '2',
              content: 'Hi! How are you doing?',
              senderId: user?.id || '',
              receiverId: recipientId,
              createdAt: new Date(Date.now() - 3500000).toISOString(),
              isRead: true
            },
            {
              id: '3',
              content: 'I'm good, thanks for asking! What about you?',
              senderId: recipientId,
              receiverId: user?.id || '',
              createdAt: new Date(Date.now() - 3400000).toISOString(),
              isRead: true
            }
          ];
          setMessages(mockMessages);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setIsLoading(false);
      }
    };

    if (matchId) {
      fetchMessages();
      
      // Join the chat room
      if (socket && isConnected) {
        socket.emit('joinRoom', { matchId });
      }
    }

    return () => {
      // Leave the chat room when component unmounts
      if (socket && isConnected) {
        socket.emit('leaveRoom', { matchId });
      }
    };
  }, [matchId, recipientId, user?.id, socket, isConnected]);

  // Listen for new messages
  useEffect(() => {
    if (socket && isConnected) {
      socket.on('newMessage', (message: Message) => {
        setMessages(prevMessages => [...prevMessages, message]);
      });

      socket.on('userTyping', ({ userId }: { userId: string }) => {
        if (userId === recipientId) {
          setIsTyping(true);
        }
      });

      socket.on('userStoppedTyping', ({ userId }: { userId: string }) => {
        if (userId === recipientId) {
          setIsTyping(false);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('newMessage');
        socket.off('userTyping');
        socket.off('userStoppedTyping');
      }
    };
  }, [socket, isConnected, recipientId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket || !isConnected) return;

    const message = {
      content: newMessage.trim(),
      senderId: user?.id || '',
      receiverId: recipientId,
      matchId
    };

    // Emit message to server
    socket.emit('sendMessage', message);

    // Optimistically add message to UI
    const optimisticMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      senderId: user?.id || '',
      receiverId: recipientId,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    setMessages(prevMessages => [...prevMessages, optimisticMessage]);
    setNewMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Emit typing event
    if (socket && isConnected) {
      socket.emit('typing', { matchId, userId: user?.id });
      
      // Clear existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set new timeout
      const timeout = setTimeout(() => {
        socket.emit('stopTyping', { matchId, userId: user?.id });
      }, 2000);
      
      setTypingTimeout(timeout);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-4 border-b dark:border-gray-700">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
            {recipientPhoto ? (
              <img 
                src={recipientPhoto} 
                alt={recipientName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                {recipientName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          )}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-gray-900 dark:text-white">{recipientName}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-2">👋</div>
            <p className="text-gray-500 dark:text-gray-400">
              No messages yet. Say hello to {recipientName}!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      isCurrentUser ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </motion.div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <PhotoIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder={`Message ${recipientName}...`}
            className="flex-grow py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full ${
              newMessage.trim()
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageThread;
