
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from 'react-router-dom';
import { LostItem, FoundItem, DonationItem } from '@/utils/dummyData';
import { MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

type ItemCardProps = {
  item: LostItem | FoundItem | DonationItem;
  type: 'lost' | 'found' | 'donation';
  onContactClick?: () => void;
};

const ItemCard: React.FC<ItemCardProps> = ({ item, type, onContactClick }) => {
  // Function to determine badge color based on item type
  const getBadgeVariant = () => {
    switch (type) {
      case 'lost':
        return 'destructive';
      case 'found':
        return 'default';
      case 'donation':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Format the date in a readable format
  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

  return (
    <Card className="overflow-hidden card-hover h-full flex flex-col">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant={getBadgeVariant()} className="capitalize">
            {type}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {formatDate(item.postedDate)}
          </Badge>
        </div>
        <CardTitle className="text-xl line-clamp-1">{item.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-grow">
        <Carousel className="w-full mb-4">
          <CarouselContent>
            {item.images.map((image, index) => (
              <CarouselItem key={index}>
                <AspectRatio ratio={4/3} className="bg-muted">
                  <img
                    src={image}
                    alt={`${item.title} - image ${index + 1}`}
                    className="rounded-md object-cover w-full h-full"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Location:</span> {item.location}
          </div>
          
          {type === 'lost' && 'reward' in item && item.reward && (
            <div className="text-sm font-medium text-recoin-accent">
              Reward: {item.reward}
            </div>
          )}
          
          {type === 'donation' && 'condition' in item && (
            <div className="text-xs">
              <span className="font-medium">Condition:</span> {item.condition}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t">
        <div className="w-full flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            <span>Posted by: {item.postedBy.name}</span>
          </div>
          <Button 
            onClick={onContactClick}
            size="sm" 
            className="bg-recoin-primary hover:bg-recoin-primary/90"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
