
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sampleLostItems, sampleFoundItems, sampleDonationItems } from '@/utils/dummyData';
import ItemCard from '@/components/ItemCard';

const Index = () => {
  // Get the most recent items of each type for the featured section
  const featuredLostItem = sampleLostItems[0];
  const featuredFoundItem = sampleFoundItems[0];
  const featuredDonationItem = sampleDonationItems[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">Recoin Rewards Hub</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8">
            Find lost items, report found items, and donate unwanted items to your community
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
            <Link to="/lost-items">
              <Button variant="default" size="lg" className="w-full bg-recoin-primary hover:bg-recoin-primary/90">
                Lost Something?
              </Button>
            </Link>
            <Link to="/found-items">
              <Button variant="default" size="lg" className="w-full bg-recoin-secondary hover:bg-recoin-secondary/90">
                Found Something?
              </Button>
            </Link>
            <Link to="/donations">
              <Button variant="default" size="lg" className="w-full bg-recoin-accent hover:bg-recoin-accent/90">
                Donate Items
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-recoin-light/30">
              <CardHeader className="text-center">
                <div className="mx-auto bg-recoin-primary/20 text-recoin-primary w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <CardTitle>Post Your Item</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>Create a listing for a lost, found, or donation item with photos and details</p>
              </CardContent>
            </Card>
            
            <Card className="bg-recoin-light/30">
              <CardHeader className="text-center">
                <div className="mx-auto bg-recoin-primary/20 text-recoin-primary w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <CardTitle>Connect & Chat</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>Receive messages from people who found your item or want to claim it</p>
              </CardContent>
            </Card>
            
            <Card className="bg-recoin-light/30">
              <CardHeader className="text-center">
                <div className="mx-auto bg-recoin-primary/20 text-recoin-primary w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <CardTitle>Resolve & Close</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>Mark as resolved once the item is returned or claimed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Featured Items */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Featured Items</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Browse these recently posted items or add your own listing
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium mb-4 flex items-center">
                <span className="w-3 h-3 rounded-full bg-destructive inline-block mr-2"></span>
                Recently Lost
              </h3>
              <ItemCard item={featuredLostItem} type="lost" />
              <div className="mt-4 text-center">
                <Link to="/lost-items">
                  <Button variant="outline" className="w-full">
                    View All Lost Items
                  </Button>
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 flex items-center">
                <span className="w-3 h-3 rounded-full bg-primary inline-block mr-2"></span>
                Recently Found
              </h3>
              <ItemCard item={featuredFoundItem} type="found" />
              <div className="mt-4 text-center">
                <Link to="/found-items">
                  <Button variant="outline" className="w-full">
                    View All Found Items
                  </Button>
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 flex items-center">
                <span className="w-3 h-3 rounded-full bg-secondary inline-block mr-2"></span>
                Available Donations
              </h3>
              <ItemCard item={featuredDonationItem} type="donation" />
              <div className="mt-4 text-center">
                <Link to="/donations">
                  <Button variant="outline" className="w-full">
                    View All Donations
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-gradient">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Using Recoin Rewards Hub Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our community platform to find your lost items, return found items, and donate what you don't need
          </p>
          <Button asChild size="lg" className="bg-recoin-primary hover:bg-recoin-primary/90">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 py-8 mt-auto">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-gradient">Recoin</span>
                <span className="text-xl font-bold text-gray-700">Rewards</span>
              </Link>
            </div>
            <div className="flex space-x-6">
              <Link to="/lost-items" className="text-gray-600 hover:text-recoin-primary">
                Lost Items
              </Link>
              <Link to="/found-items" className="text-gray-600 hover:text-recoin-primary">
                Found Items
              </Link>
              <Link to="/donations" className="text-gray-600 hover:text-recoin-primary">
                Donations
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Recoin Rewards Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
