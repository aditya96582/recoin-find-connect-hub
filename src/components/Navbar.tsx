
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { getUnreadCount } = useChat();
  
  const unreadCount = currentUser ? getUnreadCount(currentUser.id) : 0;

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gradient">Recoin</span>
            <span className="text-2xl font-bold text-gray-700">Rewards</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/lost-items" className="text-gray-700 hover:text-recoin-primary transition-colors">
            Lost Items
          </Link>
          <Link to="/found-items" className="text-gray-700 hover:text-recoin-primary transition-colors">
            Found Items
          </Link>
          <Link to="/donations" className="text-gray-700 hover:text-recoin-primary transition-colors">
            Donations
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/chat" className="relative">
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <MessageCircle className="h-5 w-5" />
                </Button>
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-recoin-accent text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback className="bg-recoin-primary text-white">
                      {currentUser?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-listings" className="cursor-pointer w-full">My Listings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/chat" className="cursor-pointer w-full">Messages</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="default" className="bg-recoin-primary hover:bg-recoin-primary/90">
              <Link to="/auth">Login / Sign Up</Link>
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden container mx-auto mt-2 px-4">
        <div className="flex justify-between space-x-2">
          <Link to="/lost-items" className="flex-1">
            <Button variant="outline" className="w-full">Lost</Button>
          </Link>
          <Link to="/found-items" className="flex-1">
            <Button variant="outline" className="w-full">Found</Button>
          </Link>
          <Link to="/donations" className="flex-1">
            <Button variant="outline" className="w-full">Donate</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
