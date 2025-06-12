import React, { useState } from 'react';
import { useGetMatchesQuery } from '../api';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface Match {
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

const Matches: React.FC = () => {
  const { data: matches = [], isLoading, error } = useGetMatchesQuery();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messageInput, setMessageInput] = useState('');
  
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedMatch) return;
    
    // In a real app, we would call an API to send the message
    console.log('Sending message to', selectedMatch.matchedUser.name, ':', messageInput);
    
    // Clear the input
    setMessageInput('');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error loading matches</h2>
        <p className="text-gray-600 dark:text-gray-300">Please try again later</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Matches</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-200px)]">
          {/* Matches list */}
          <div className="border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            {matches.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No matches yet</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Keep swiping to find your match!
                </p>
              </div>
            ) : (
              <ul>
                {matches.map((match) => (
                  <li 
                    key={match.id}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedMatch?.id === match.id ? 'bg-purple-50 dark:bg-gray-700' : ''}`}
                    onClick={() => setSelectedMatch(match)}
                  >
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                        <img 
                          src={match.matchedUser.profilePicture || 'https://via.placeholder.com/100?text=User'} 
                          alt={match.matchedUser.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {match.matchedUser.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {match.messages.length > 0 
                            ? match.messages[match.messages.length - 1].content.substring(0, 30) + (match.messages[match.messages.length - 1].content.length > 30 ? '...' : '')
                            : 'Start a conversation'}
                        </p>
                      </div>
                      <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                        {match.messages.length > 0 
                          ? new Date(match.messages[match.messages.length - 1].timestamp).toLocaleDateString()
                          : new Date(match.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Chat area */}
          <div className="col-span-2 flex flex-col h-full">
            {selectedMatch ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={selectedMatch.matchedUser.profilePicture || 'https://via.placeholder.com/100?text=User'} 
                      alt={selectedMatch.matchedUser.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {selectedMatch.matchedUser.name}
                  </h3>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {selectedMatch.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Send a message to start the conversation
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedMatch.messages.map((message) => {
                        const isOwnMessage = message.senderId !== selectedMatch.matchedUser.id;
                        
                        return (
                          <div 
                            key={message.id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-xs rounded-lg px-4 py-2 ${
                                isOwnMessage 
                                  ? 'bg-purple-500 text-white' 
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${isOwnMessage ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Message input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="ml-2 p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                      disabled={!messageInput.trim()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Your Messages</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Select a match to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matches;
