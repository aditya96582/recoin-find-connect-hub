
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ItemCard from '@/components/ItemCard';
import ImageUpload from '@/components/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { FoundItem, sampleFoundItems } from '@/utils/dummyData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FoundItems = () => {
  const [items, setItems] = useState<FoundItem[]>(sampleFoundItems);
  const [selectedItem, setSelectedItem] = useState<FoundItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  
  // New item form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [foundDate, setFoundDate] = useState('');
  
  const { currentUser, isAuthenticated } = useAuth();
  const { sendMessage } = useChat();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleContactClick = (item: FoundItem) => {
    setSelectedItem(item);
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to contact the finder",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    setChatDialogOpen(true);
  };
  
  const handleChatSubmit = (message: string) => {
    if (!currentUser || !selectedItem) return;
    
    // Send message to the item finder
    sendMessage(
      message,
      selectedItem.postedBy.id,
      selectedItem.id,
      'found'
    );
    
    setChatDialogOpen(false);
    navigate('/chat');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to post a found item",
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
    
    // Create new found item
    const newItem: FoundItem = {
      id: `found_${Date.now()}`,
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
      foundDate: foundDate ? new Date(foundDate) : new Date(),
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
    setFoundDate('');
    
    // Close dialog
    setDialogOpen(false);
    
    toast({
      title: "Item Posted",
      description: "Your found item has been posted successfully"
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
            <h1 className="text-3xl font-bold mb-2">Found Items</h1>
            <p className="text-muted-foreground">
              Browse found items or report something you've found
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-recoin-secondary hover:bg-recoin-secondary/90">
                Report a Found Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Report a Found Item</DialogTitle>
                <DialogDescription>
                  Provide details about the item you found to help locate its owner.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Found Black Wallet"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the item in detail..."
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
                    <Label htmlFor="location">Found Location *</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Central Park"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="foundDate">Found Date</Label>
                  <Input
                    id="foundDate"
                    type="date"
                    value={foundDate}
                    onChange={(e) => setFoundDate(e.target.value)}
                  />
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
                  <Button type="submit" className="bg-recoin-secondary hover:bg-recoin-secondary/90">
                    Post Found Item
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
                type="found"
                onContactClick={() => handleContactClick(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Found Items Listed</h3>
            <p className="text-muted-foreground mb-4">
              No items match your search criteria or there are no found items posted yet.
            </p>
            <Button 
              onClick={() => setDialogOpen(true)}
              className="bg-recoin-secondary hover:bg-recoin-secondary/90"
            >
              Report a Found Item
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
              Send a message to {selectedItem?.postedBy.name} about this found item.
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{selectedItem.title}</p>
                <p className="text-sm text-muted-foreground truncate">{selectedItem.description}</p>
              </div>
              
              <Tabs defaultValue="claim">
                <TabsList className="w-full">
                  <TabsTrigger value="claim" className="flex-1">This is Mine</TabsTrigger>
                  <TabsTrigger value="info" className="flex-1">Request Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="claim" className="space-y-4 mt-4">
                  <Textarea 
                    placeholder="Describe the item in detail to prove ownership..."
                    className="min-h-[100px]"
                    id="claim-message"
                  />
                  <Button 
                    className="w-full bg-recoin-secondary hover:bg-recoin-secondary/90" 
                    onClick={() => {
                      const message = (document.getElementById('claim-message') as HTMLTextAreaElement).value;
                      if (message.trim()) {
                        handleChatSubmit(`I believe this is my item: ${message}`);
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
                    className="w-full bg-recoin-secondary hover:bg-recoin-secondary/90" 
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

export default FoundItems;
