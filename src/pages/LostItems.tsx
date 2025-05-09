
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ItemCard from '@/components/ItemCard';
import ImageUpload from '@/components/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { LostItem, sampleLostItems } from '@/utils/dummyData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const LostItems = () => {
  const [items, setItems] = useState<LostItem[]>(sampleLostItems);
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  
  // New item form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [reward, setReward] = useState('');
  const [lastSeenDate, setLastSeenDate] = useState('');
  
  const { currentUser, isAuthenticated } = useAuth();
  const { sendMessage } = useChat();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleContactClick = (item: LostItem) => {
    setSelectedItem(item);
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to contact the owner",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    setChatDialogOpen(true);
  };
  
  const handleChatSubmit = (message: string) => {
    if (!currentUser || !selectedItem) return;
    
    // Send message to the item owner
    sendMessage(
      message,
      selectedItem.postedBy.id,
      selectedItem.id,
      'lost'
    );
    
    setChatDialogOpen(false);
    navigate('/chat');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to post a lost item",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    if (!title || !description || !category || !location || images.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields and add at least one image",
        variant: "destructive"
      });
      return;
    }
    
    // Create new lost item
    const newItem: LostItem = {
      id: `lost_${Date.now()}`,
      title,
      description,
      images,
      location,
      category,
      postedBy: {
        id: currentUser.id,
        name: currentUser.name
      },
      postedDate: new Date(),
      lastSeenDate: lastSeenDate ? new Date(lastSeenDate) : new Date(),
      reward: reward || undefined,
      isActive: true
    };
    
    // Add to items list
    setItems([newItem, ...items]);
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setImages([]);
    setReward('');
    setLastSeenDate('');
    
    // Close dialog
    setDialogOpen(false);
    
    toast({
      title: "Item Posted",
      description: "Your lost item has been posted successfully"
    });
  };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  
  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory && item.isActive;
  });
  
  // Get unique categories
  const categories = Array.from(new Set(items.map(item => item.category)));
  
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lost Items</h1>
            <p className="text-muted-foreground">
              Browse lost items or report something you've lost
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-recoin-primary hover:bg-recoin-primary/90">
                Report a Lost Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Report a Lost Item</DialogTitle>
                <DialogDescription>
                  Provide details about your lost item to help others find it.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Black Leather Wallet"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your item in detail..."
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Personal Items">Personal Items</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Pets">Pets</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Documents">Documents</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Last Seen Location *</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Central Park"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastSeenDate">Last Seen Date</Label>
                    <Input
                      id="lastSeenDate"
                      type="date"
                      value={lastSeenDate}
                      onChange={(e) => setLastSeenDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reward">Reward (optional)</Label>
                    <Input
                      id="reward"
                      value={reward}
                      onChange={(e) => setReward(e.target.value)}
                      placeholder="e.g., $50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Images *</Label>
                  <ImageUpload
                    value={images}
                    onChange={setImages}
                    maxImages={5}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="bg-recoin-primary hover:bg-recoin-primary/90">
                    Post Lost Item
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Filters */}
        <Card className="mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="search" className="mb-2 block">Search</Label>
              <Input
                id="search"
                placeholder="Search by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="category-filter" className="mb-2 block">Filter by Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
        
        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                type="lost"
                onContactClick={() => handleContactClick(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Lost Items Found</h3>
            <p className="text-muted-foreground mb-4">
              No items match your search criteria or there are no lost items posted yet.
            </p>
            <Button 
              onClick={() => setDialogOpen(true)}
              className="bg-recoin-primary hover:bg-recoin-primary/90"
            >
              Report a Lost Item
            </Button>
          </div>
        )}
      </div>
      
      {/* Chat Dialog */}
      <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact About {selectedItem?.title}</DialogTitle>
            <DialogDescription>
              Send a message to {selectedItem?.postedBy.name} about their lost item.
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{selectedItem.title}</p>
                <p className="text-sm text-muted-foreground truncate">{selectedItem.description}</p>
              </div>
              
              <Tabs defaultValue="found">
                <TabsList className="w-full">
                  <TabsTrigger value="found" className="flex-1">I Found This</TabsTrigger>
                  <TabsTrigger value="info" className="flex-1">Request Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="found" className="space-y-4 mt-4">
                  <Textarea 
                    placeholder="Describe where and when you found this item..."
                    className="min-h-[100px]"
                    id="found-message"
                  />
                  <Button 
                    className="w-full bg-recoin-primary hover:bg-recoin-primary/90" 
                    onClick={() => {
                      const message = (document.getElementById('found-message') as HTMLTextAreaElement).value;
                      if (message.trim()) {
                        handleChatSubmit(`I found your item: ${message}`);
                      } else {
                        toast({
                          title: "Message Required",
                          description: "Please enter a message",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    Send Message
                  </Button>
                </TabsContent>
                
                <TabsContent value="info" className="space-y-4 mt-4">
                  <Textarea 
                    placeholder="Ask for more details about this item..."
                    className="min-h-[100px]"
                    id="info-message"
                  />
                  <Button 
                    className="w-full bg-recoin-primary hover:bg-recoin-primary/90" 
                    onClick={() => {
                      const message = (document.getElementById('info-message') as HTMLTextAreaElement).value;
                      if (message.trim()) {
                        handleChatSubmit(message);
                      } else {
                        toast({
                          title: "Message Required",
                          description: "Please enter a message",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    Send Message
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LostItems;
