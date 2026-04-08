import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, demoUser } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  addTokens: (amount: number) => void;
  addReputation: (amount: number) => void;
  incrementHelps: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("cc_user");
    if (stored) {
      try { setCurrentUser(JSON.parse(stored)); } catch { localStorage.removeItem("cc_user"); }
    }
    setLoading(false);
  }, []);

  const saveUser = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem("cc_user", JSON.stringify(user));
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const user = { ...demoUser, email };
    saveUser(user);
    toast({ title: "Welcome back!", description: `Logged in as ${user.name}` });
    setLoading(false);
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const user: UserProfile = {
      ...demoUser, id: `user_${Date.now()}`, name, email,
      tokens: 10, reputation: 0, totalHelps: 0, badges: [],
    };
    saveUser(user);
    toast({ title: "Account created!", description: "Welcome to CampusConnect AI" });
    setLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("cc_user");
    toast({ title: "Logged out" });
  };

  const addTokens = (amount: number) => {
    if (!currentUser) return;
    const updated = { ...currentUser, tokens: currentUser.tokens + amount };
    saveUser(updated);
    toast({ title: `+${amount} Tokens earned! 🎉` });
  };

  const addReputation = (amount: number) => {
    if (!currentUser) return;
    saveUser({ ...currentUser, reputation: Math.min(5, currentUser.reputation + amount) });
  };

  const incrementHelps = () => {
    if (!currentUser) return;
    saveUser({ ...currentUser, totalHelps: currentUser.totalHelps + 1 });
  };

  return (
    <AuthContext.Provider value={{
      currentUser, loading, login, signup, logout,
      isAuthenticated: !!currentUser, addTokens, addReputation, incrementHelps,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
