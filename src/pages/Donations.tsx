
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ItemCard from '@/components/ItemCard';
import ImageUpload from '@/components/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { DonationItem, sampleDonationItems } from '@/utils/dummyData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Donations = () => {
  const [items, setItems] = useState<DonationItem[]>(sampleDonationItems);
  const [selectedItem, setSelectedItem] = useState<DonationItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  
  // New item form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  
  const { currentUser, isAuthenticated } = useAuth();
  const { sendMessage } = useChat();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleContactClick = (item: DonationItem) => {
    setSelectedItem(item);
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to contact the donor",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    setChatDialogOpen(true);
  };
  
  const handleChatSubmit = (message: string) => {
    if (!currentUser || !selectedItem) return;
    
    // Send message to the item donor
    sendMessage(
      message,
      selectedItem.postedBy.id,
      selectedItem.id,
      'donation'
    );
    
    setChatDialogOpen(false);
    navigate('/chat');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to post a donation",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    if (!title || !description || !category || !condition || !location || images.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields and add at least one image",
        variant: "destructive"
      });
      return;
    }
    
    // Create new donation item
    const newItem: DonationItem = {
      id: `donation_${Date.now()}`,
      title,
      description,
      images,
      location,
      category,
      condition,
      postedBy: {
        id: currentUser.id,
        name: currentUser.name
      },
      postedDate: new Date(),
      isActive: true
    };
    
    // Add to items list
    setItems([newItem, ...items]);
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setCondition('');
    setLocation('');
    setImages([]);
    
    // Close dialog
    setDialogOpen(false);
    
    toast({
      title: "Item Posted",
      description: "Your donation item has been posted successfully"
    });
  };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedCondition, setSelectedCondition] = useState<string | undefined>(undefined);
  
  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesCondition = !selectedCondition || item.condition === selectedCondition;
    
    return matchesSearch && matchesCategory && matchesCondition && item.isActive;
  });
  
  // Get unique categories and conditions
  const categories = Array.from(new Set(items.map(item => item.category)));
  const conditions = Array.from(new Set(items.map(item => item.condition)));
  
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Donations</h1>
            <p className="text-muted-foreground">
              Browse available donations or offer your own items
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-recoin-accent hover:bg-recoin-accent/90">
                Offer a Donation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Offer an Item for Donation</DialogTitle>
                <DialogDescription>
                  Provide details about the item you're donating to help others find what they need.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Gently Used Sofa"
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
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                        <SelectItem value="Kitchen">Kitchen</SelectItem>
                        <SelectItem value="Toys">Toys</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Pickup Location *</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Downtown, Springfield"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Item Condition *</Label>
                  <RadioGroup value={condition} onValueChange={setCondition} className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="New" id="new" />
                      <Label htmlFor="new">New</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Excellent" id="excellent" />
                      <Label htmlFor="excellent">Excellent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Good" id="good" />
                      <Label htmlFor="good">Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Fair" id="fair" />
                      <Label htmlFor="fair">Fair</Label>
                    </div>
                  </RadioGroup>
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
                  <Button type="submit" className="bg-recoin-accent hover:bg-recoin-accent/90">
                    Post Donation
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Filters */}
        <Card className="mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="search" className="mb-2 block">Search</Label>
              <Input
                id="search"
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="category-filter" className="mb-2 block">Category</Label>
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
            
            <div>
              <Label htmlFor="condition-filter" className="mb-2 block">Condition</Label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>Any Condition</SelectItem>
                  {conditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
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
                type="donation"
                onContactClick={() => handleContactClick(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Donations Available</h3>
            <p className="text-muted-foreground mb-4">
              No items match your search criteria or there are no donations posted yet.
            </p>
            <Button 
              onClick={() => setDialogOpen(true)}
              className="bg-recoin-accent hover:bg-recoin-accent/90"
            >
              Offer a Donation
            </Button>
          </div>
        )}
      </div>
      
      {/* Chat Dialog */}
      <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request {selectedItem?.title}</DialogTitle>
            <DialogDescription>
              Send a message to {selectedItem?.postedBy.name} about this donation.
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{selectedItem.title}</p>
                <p className="text-sm text-muted-foreground truncate">{selectedItem.description}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Condition:</span> {selectedItem.condition}
                </p>
              </div>
              
              <Textarea 
                placeholder="Let the donor know why you're interested in this item..."
                className="min-h-[100px]"
                id="request-message"
              />
              
              <Button 
                className="w-full bg-recoin-accent hover:bg-recoin-accent/90" 
                onClick={() => {
                  const message = (document.getElementById('request-message') as HTMLTextAreaElement).value;
                  if (message.trim()) {
                    handleChatSubmit(`I'm interested in your donation: ${message}`);
                  } else {
                    toast({
                      title: "Message Required",
                      description: "Please enter a message",
                      variant: "destructive"
                    });
                  }
                }}
              >
                Send Request
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Donations;
