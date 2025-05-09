
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  maxImages?: number;
  onChange: (images: string[]) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ maxImages = 5, onChange, value }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (value.length + files.length > maxImages) {
      toast({
        title: "Maximum images reached",
        description: `You can only upload up to ${maxImages} images`,
        variant: "destructive",
      });
      return;
    }

    // Convert File objects to data URLs
    const newImages: string[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string);
          // Only update state when all files are processed
          if (newImages.length === files.length) {
            onChange([...value, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {value.length > 0 ? (
        <Carousel className="w-full">
          <CarouselContent>
            {value.map((image, index) => (
              <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                <div className="relative p-1">
                  <AspectRatio ratio={4/3} className="bg-muted rounded-md overflow-hidden">
                    <img
                      src={image}
                      alt={`Uploaded image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                      aria-label="Delete image"
                    >
                      ✕
                    </button>
                  </AspectRatio>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div 
          className="border-2 border-dashed border-muted rounded-md p-8 text-center cursor-pointer hover:border-recoin-primary/50 transition-colors"
          onClick={triggerFileInput}
        >
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-semibold text-recoin-primary hover:text-recoin-primary/80"
            >
              <span>Upload images</span>
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            PNG, JPG, GIF up to 5MB each (max {maxImages} images)
          </p>
        </div>
      )}
      
      {value.length < maxImages && (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={triggerFileInput}
            variant="outline"
            size="sm"
          >
            <Image className="mr-2 h-4 w-4" />
            Add {value.length > 0 ? 'More' : ''} Images
          </Button>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />
      
      <div className="text-xs text-muted-foreground text-center">
        {value.length} of {maxImages} images
      </div>
    </div>
  );
};

export default ImageUpload;
