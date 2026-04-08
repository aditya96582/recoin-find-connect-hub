import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useChat } from "@/contexts/ChatContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell, MessageCircle, Search, Menu, LogOut, User, LayoutDashboard,
} from "lucide-react";

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { unreadCount: notifCount, notifications, markAllRead } = useNotifications();
  const { getUnreadCount } = useChat();
  const navigate = useNavigate();
  const chatUnread = getUnreadCount();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">CC</div>
          <span className="text-xl font-bold text-gradient hidden sm:inline">CampusConnect AI</span>
        </Link>

        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/lost-items" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Lost & Found</Link>
            <Link to="/emergency" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Emergency</Link>
            <Link to="/medical" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Medical</Link>
            <Link to="/rewards" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rewards</Link>
          </div>
        )}

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs h-5 w-5 flex items-center justify-center rounded-full">{notifCount}</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 glass-strong">
                  <DropdownMenuLabel className="flex justify-between">
                    Notifications
                    <button onClick={markAllRead} className="text-xs text-primary">Mark all read</button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.slice(0, 5).map(n => (
                    <DropdownMenuItem key={n.id} className={`flex flex-col items-start gap-1 ${!n.read ? 'bg-primary/5' : ''}`}
                      onClick={() => n.actionUrl && navigate(n.actionUrl)}>
                      <span className="font-medium text-sm">{n.title}</span>
                      <span className="text-xs text-muted-foreground">{n.description}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/chat" className="relative">
                <Button variant="ghost" size="icon">
                  <MessageCircle className="h-5 w-5" />
                  {chatUnread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs h-5 w-5 flex items-center justify-center rounded-full">{chatUnread}</span>
                  )}
                </Button>
              </Link>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50">
                <span className="text-sm">🪙</span>
                <span className="text-sm font-medium">{currentUser?.tokens || 0}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer h-8 w-8 border-2 border-primary/30">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">{currentUser?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-strong">
                  <DropdownMenuLabel>{currentUser?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/analytics')}><Search className="mr-2 h-4 w-4" />Analytics</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { logout(); navigate('/'); }} className="text-destructive"><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => navigate('/auth')} className="glow-primary">Get Started</Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
