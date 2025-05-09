import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat, Message, Conversation } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatBoxProps {
  receiverId?: string;
  receiverName?: string;
  itemId?: string;
  itemType?: "lost" | "found" | "donation";
  itemTitle?: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ 
  receiverId, 
  receiverName,
  itemId,
  itemType,
  itemTitle
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | undefined>(receiverId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { currentUser } = useAuth();
  const { 
    conversations, 
    activeConversation, 
    setActiveConversation, 
    messages, 
    sendMessage, 
    markAsResolved 
  } = useChat();

  // Filter to get only active conversations
  const activeConversations = conversations.filter(c => c.isActive);
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Set initial active conversation based on props
  useEffect(() => {
    if (receiverId && itemId && itemType && currentUser) {
      // Check if conversation already exists
      const existingConversation = conversations.find(
        c => c.participants.includes(receiverId) && 
             c.participants.includes(currentUser.id) && 
             c.itemId === itemId &&
             c.itemType === itemType &&
             c.isActive
      );
      
      if (existingConversation) {
        setActiveConversation(existingConversation);
      }
      
      setSelectedReceiverId(receiverId);
    }
  }, [receiverId, itemId, itemType, currentUser, conversations, setActiveConversation]);
  
  const handleSendMessage = () => {
    if (!currentUser || !selectedReceiverId || !newMessage.trim()) return;
    
    // If we're in a conversation, use that itemId and type
    if (activeConversation) {
      sendMessage(newMessage, selectedReceiverId, activeConversation.itemId, activeConversation.itemType);
    } 
    // Otherwise, use the provided props (for new conversations)
    else if (itemId && itemType) {
      sendMessage(newMessage, selectedReceiverId, itemId, itemType);
    }
    
    setNewMessage('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    // Find the other user in the conversation (not the current user)
    const otherUserId = conversation.participants.find(id => id !== currentUser?.id);
    if (otherUserId) {
      setSelectedReceiverId(otherUserId);
    }
  };
  
  const handleResolveConversation = () => {
    if (activeConversation) {
      markAsResolved(activeConversation.id);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold">Login Required</h3>
        <p className="text-muted-foreground mt-2 text-center max-w-xs">
          Please login to access messages and chat with users
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-14rem)]">
      {/* Conversation List */}
      <div className="md:col-span-1 border rounded-lg overflow-hidden">
        <div className="bg-muted p-4 border-b">
          <h3 className="font-semibold">Conversations</h3>
        </div>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {activeConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No active conversations</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {activeConversations.map((conversation) => {
                // Find the other participant (not current user)
                const otherParticipantId = conversation.participants.find(
                  id => id !== currentUser.id
                );
                
                // For demo purposes, create a simple name based on the ID
                const otherParticipantName = otherParticipantId || "Unknown User";
                
                return (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                      activeConversation?.id === conversation.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {otherParticipantName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {otherParticipantName.split('user')[1] === '2' ? 'Sarah Johnson' : 
                           otherParticipantName.split('user')[1] === '3' ? 'Michael Brown' : 
                           otherParticipantName.split('user')[1] === '4' ? 'Emily Davis' : 
                           otherParticipantName.split('user')[1] === '5' ? 'David Wilson' : 
                           'User ' + otherParticipantName.split('user')[1]}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage?.content || "No messages yet"}
                        </p>
                      </div>
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs flex justify-between items-center">
                      <span className="capitalize text-muted-foreground">
                        {conversation.itemType} Item
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
      
      {/* Chat Area */}
      <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col">
        {activeConversation || (receiverId && itemId && itemType) ? (
          <>
            <div className="bg-muted p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  {receiverName || 
                    (selectedReceiverId === 'user2' ? 'Sarah Johnson' : 
                     selectedReceiverId === 'user3' ? 'Michael Brown' : 
                     selectedReceiverId === 'user4' ? 'Emily Davis' : 
                     selectedReceiverId === 'user5' ? 'David Wilson' : 
                     'User ' + selectedReceiverId?.split('user')[1])}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {itemTitle || activeConversation?.itemType + ' Item'}
                </p>
              </div>
              
              {activeConversation && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Mark as Resolved
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Mark Conversation as Resolved?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will end the conversation and remove the listing. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResolveConversation}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isCurrentUser = message.senderId === currentUser.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%]`}>
                          <div
                            className={`rounded-lg p-3 ${
                              isCurrentUser
                                ? 'bg-recoin-primary text-white'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Conversation Selected</h3>
            <p className="text-muted-foreground mt-2 max-w-xs">
              Select a conversation from the sidebar or start a new one from a listing
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
