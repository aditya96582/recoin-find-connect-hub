import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useItems } from "@/contexts/ItemContext";
import { useNotifications } from "@/contexts/NotificationContext";
import Navbar from "@/components/Navbar";
import ImageUpload from "@/components/ImageUpload";
import { categories } from "@/data/mockData";
import { Search, Plus, MapPin, Calendar, Coins, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LostItems = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { lostItems, foundItems, addLostItem, addFoundItem, runAIMatch } = useItems();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'lost' | 'found'>('lost');
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [matching, setMatching] = useState(false);
  const [image, setImage] = useState<string | undefined>();
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '', reward: '0' });

  useEffect(() => { if (!isAuthenticated) navigate('/auth'); }, [isAuthenticated]);

  const handleAdd = () => {
    if (!currentUser || !form.title || !form.category || !form.location) return;
    if (tab === 'lost') {
      addLostItem({ ...form, date: new Date().toISOString().split('T')[0], reward: parseInt(form.reward) || 0, userId: currentUser.id, userName: currentUser.name, aiGenerated: !form.description, image });
    } else {
      addFoundItem({ ...form, date: new Date().toISOString().split('T')[0], userId: currentUser.id, userName: currentUser.name, image });
    }
    setForm({ title: '', description: '', category: '', location: '', reward: '0' });
    setImage(undefined);
    setShowAddDialog(false);
  };

  const handleAIMatch = async () => {
    setMatching(true);
    await new Promise(r => setTimeout(r, 2000));
    const newMatches = runAIMatch();
    setMatching(false);
    if (newMatches.length > 0) {
      addNotification({ type: 'match', title: '🔥 New Matches Found!', description: `AI found ${newMatches.length} possible match(es)`, actionUrl: '/matches' });
    }
  };

  const items = tab === 'lost' ? lostItems : foundItems;
  const filtered = items.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Lost & <span className="text-gradient">Found</span></h1>
            <p className="text-muted-foreground text-sm">AI-powered item recovery system</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleAIMatch} variant="outline" disabled={matching} className="glow-primary">
              <Brain className="mr-2 h-4 w-4" />{matching ? 'Matching...' : 'Run AI Match'}
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Report Item</Button></DialogTrigger>
              <DialogContent className="glass-strong">
                <DialogHeader><DialogTitle>Report {tab === 'lost' ? 'Lost' : 'Found'} Item</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button variant={tab === 'lost' ? 'default' : 'outline'} onClick={() => setTab('lost')} className="flex-1">Lost</Button>
                    <Button variant={tab === 'found' ? 'default' : 'outline'} onClick={() => setTab('found')} className="flex-1">Found</Button>
                  </div>
                  <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Black Nike Backpack" className="bg-secondary/50" /></div>
                  <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed description..." className="bg-secondary/50" /></div>
                  <div><Label>Category</Label>
                    <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                      <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Where was it lost/found?" className="bg-secondary/50" /></div>
                  {tab === 'lost' && <div><Label>Reward (Tokens)</Label><Input type="number" value={form.reward} onChange={e => setForm({ ...form, reward: e.target.value })} className="bg-secondary/50" /></div>}
                  <Button onClick={handleAdd} className="w-full">Submit Report</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Button variant={tab === 'lost' ? 'default' : 'outline'} onClick={() => setTab('lost')}>Lost Items ({lostItems.filter(i => i.status === 'active').length})</Button>
          <Button variant={tab === 'found' ? 'default' : 'outline'} onClick={() => setTab('found')}>Found Items ({foundItems.filter(i => i.status === 'active').length})</Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search items..." className="pl-10 bg-secondary/50" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`glass hover:glow-primary transition-all ${item.status === 'resolved' ? 'opacity-50' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={tab === 'lost' ? 'bg-destructive/20 text-destructive border-destructive/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}>
                      {tab === 'lost' ? 'Lost' : 'Found'} • {item.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</div>
                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{item.date}</div>
                  </div>
                  {'reward' in item && (item as any).reward > 0 && (
                    <div className="mt-3 flex items-center gap-1 text-sm font-medium text-warning"><Coins className="h-4 w-4" /> {(item as any).reward} tokens reward</div>
                  )}
                  <div className="mt-3 text-xs text-muted-foreground">By {item.userName}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground"><Search className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No items found</p></div>
        )}
      </div>
    </div>
  );
};

export default LostItems;
