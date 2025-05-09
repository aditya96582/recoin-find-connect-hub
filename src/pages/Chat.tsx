
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChatBox from '@/components/ChatBox';
import { useChat, Conversation } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Inbox, Check, CheckCheck } from 'lucide-react';

const Chat = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { conversations, activeConversation, setActiveConversation, markAsResolved } = useChat();
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Filter active conversations for current user
  const [activeConversations, setActiveConversations] = useState<Conversation[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    // Filter only active conversations
    if (conversations) {
      const active = conversations.filter(conv => conv.isActive);
      setActiveConversations(active);
    }
  }, [conversations]);
  
  const handleMarkAsResolved = () => {
    if (activeConversation) {
      markAsResolved(activeConversation.id);
      toast({
        title: "Success",
        description: "This conversation has been marked as resolved and the listing will be removed from public view.",
      });
      
      // Set a timer to show a success message and redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
    setResolveDialogOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">
            View and respond to conversations about your listings
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-lg mb-4">Active Conversations</h2>
            
            {activeConversations.length > 0 ? (
              <div className="space-y-2">
                {activeConversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`p-3 rounded-md cursor-pointer transition hover:bg-muted/50 ${
                      activeConversation?.id === conversation.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium text-sm">
                        {conversation.itemType === 'lost' ? 'Lost Item' : 
                         conversation.itemType === 'found' ? 'Found Item' : 'Donation'}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        conversation.itemType === 'lost' ? 'bg-destructive/10 text-destructive' : 
                        conversation.itemType === 'found' ? 'bg-primary/10 text-primary' : 
                        'bg-secondary/10 text-secondary'
                      }`}>
                        {conversation.itemType}
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs mt-1 truncate">
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No active conversations</p>
              </div>
            )}
          </div>
          
          {/* Chat Box */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow">
            {activeConversation ? (
              <div className="flex flex-col h-full">
                <div className="border-b p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      {activeConversation.itemType === 'lost' ? 'Lost Item Conversation' : 
                       activeConversation.itemType === 'found' ? 'Found Item Conversation' : 
                       'Donation Conversation'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      ID: {activeConversation.itemId}
                    </p>
                  </div>
                  
                  <AlertDialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Check className="h-4 w-4 mr-1" /> 
                        Mark as Resolved
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mark as Resolved</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to mark this conversation as resolved? This will:
                          <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Remove the listing from public view</li>
                            <li>Archive this conversation</li>
                            <li>Prevent further messages in this thread</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMarkAsResolved} className="bg-recoin-primary">
                          <CheckCheck className="h-4 w-4 mr-1" /> Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <ChatBox />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 font-medium">No conversation selected</h3>
                  <p className="text-muted-foreground">Select a conversation from the sidebar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
