
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth, User } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
};

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage?: Message;
  itemId: string;
  itemType: "lost" | "found" | "donation";
  isActive: boolean;
};

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  sendMessage: (content: string, receiverId: string, itemId: string, itemType: "lost" | "found" | "donation") => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  markAsResolved: (conversationId: string) => void;
  getUnreadCount: (userId: string) => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Load conversations from localStorage
  useEffect(() => {
    if (currentUser) {
      const storedConversations = localStorage.getItem(`conversations_${currentUser.id}`);
      if (storedConversations) {
        try {
          const parsedConversations = JSON.parse(storedConversations);
          setConversations(parsedConversations);
        } catch (error) {
          console.error("Failed to parse stored conversations:", error);
        }
      }
    }
  }, [currentUser]);

  // Save conversations to localStorage when they change
  useEffect(() => {
    if (currentUser && conversations.length > 0) {
      localStorage.setItem(`conversations_${currentUser.id}`, JSON.stringify(conversations));
    }
  }, [conversations, currentUser]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      const storedMessages = localStorage.getItem(`messages_${activeConversation.id}`);
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
          // Convert string timestamps back to Date objects
          const messagesWithDateObjects = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDateObjects);
        } catch (error) {
          console.error("Failed to parse stored messages:", error);
        }
      } else {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  // Save messages when they change
  useEffect(() => {
    if (activeConversation && messages.length > 0) {
      localStorage.setItem(`messages_${activeConversation.id}`, JSON.stringify(messages));
    }
  }, [messages, activeConversation]);

  const sendMessage = (content: string, receiverId: string, itemId: string, itemType: "lost" | "found" | "donation") => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Message cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Create a new message
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: new Date(),
      read: false,
    };

    // Check if we already have a conversation with this receiver about this item
    let conversation = conversations.find(
      c => c.participants.includes(receiverId) && 
           c.participants.includes(currentUser.id) && 
           c.itemId === itemId &&
           c.isActive
    );

    if (conversation) {
      // Update existing conversation
      setMessages(prev => [...prev, newMessage]);
      
      // Update last message in conversation
      const updatedConversations = conversations.map(c => {
        if (c.id === conversation!.id) {
          return {
            ...c,
            lastMessage: newMessage
          };
        }
        return c;
      });
      
      setConversations(updatedConversations);
      setActiveConversation({...conversation, lastMessage: newMessage});
    } else {
      // Create a new conversation
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        participants: [currentUser.id, receiverId],
        lastMessage: newMessage,
        itemId,
        itemType,
        isActive: true
      };
      
      setConversations(prev => [...prev, newConversation]);
      setActiveConversation(newConversation);
      setMessages([newMessage]);
    }

    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });
  };

  const markAsResolved = (conversationId: string) => {
    // Update conversation to mark it as resolved
    const updatedConversations = conversations.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          isActive: false
        };
      }
      return c;
    });
    
    setConversations(updatedConversations);
    
    // If the active conversation is being resolved, clear it
    if (activeConversation && activeConversation.id === conversationId) {
      setActiveConversation(null);
    }
    
    toast({
      title: "Marked as resolved",
      description: "This conversation has been marked as resolved",
    });

    // In a real app, you might also want to update the related item listing status
  };

  const getUnreadCount = (userId: string) => {
    return conversations.reduce((count, conversation) => {
      // Only count unread messages in active conversations
      if (!conversation.isActive) return count;
      
      // Find the last message in this conversation
      const lastMessage = conversation.lastMessage;
      
      // If there's a last message, it's not from the current user, and it's unread, increment count
      if (lastMessage && lastMessage.receiverId === userId && !lastMessage.read) {
        return count + 1;
      }
      
      return count;
    }, 0);
  };

  const value = {
    conversations,
    activeConversation,
    messages,
    sendMessage,
    setActiveConversation,
    markAsResolved,
    getUnreadCount
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
