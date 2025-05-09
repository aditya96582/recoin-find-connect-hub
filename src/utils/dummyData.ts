
// Sample data for demonstration purposes
export type ItemBase = {
  id: string;
  title: string;
  description: string;
  images: string[];
  location: string;
  postedBy: {
    id: string;
    name: string;
  };
  postedDate: Date;
  isActive: boolean;
};

export type LostItem = ItemBase & {
  category: string;
  lastSeenDate: Date;
  reward?: string;
};

export type FoundItem = ItemBase & {
  category: string;
  foundDate: Date;
};

export type DonationItem = ItemBase & {
  category: string;
  condition: string;
};

// Sample images (using placeholders)
const sampleImages = [
  "/placeholder.svg",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop", // Laptop
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop", // Person with laptop
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop", // Gray laptop
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=400&fit=crop", // Code on screen
  "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop"  // Food item
];

// Helper function to get random subset of images (1-5)
const getRandomImages = () => {
  const count = Math.floor(Math.random() * 5) + 1; // 1 to 5 images
  const shuffled = [...sampleImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate sample data
export const sampleLostItems: LostItem[] = [
  {
    id: "lost1",
    title: "Lost MacBook Pro 16-inch",
    description: "I lost my MacBook Pro 16-inch with a black case at Central Park. It has my company sticker on the back and has important work files.",
    images: getRandomImages(),
    location: "Central Park, New York",
    postedBy: {
      id: "user1",
      name: "John Smith"
    },
    postedDate: new Date(2025, 4, 5),
    isActive: true,
    category: "Electronics",
    lastSeenDate: new Date(2025, 4, 4),
    reward: "$500"
  },
  {
    id: "lost2",
    title: "Missing iPhone 15 Pro",
    description: "Lost my iPhone 15 Pro (128GB, Pacific Blue) at the Main Street Cafe. It has a clear case with my ID in the back pocket.",
    images: getRandomImages(),
    location: "Main Street Cafe",
    postedBy: {
      id: "user2",
      name: "Sarah Johnson"
    },
    postedDate: new Date(2025, 4, 7),
    isActive: true,
    category: "Electronics",
    lastSeenDate: new Date(2025, 4, 7),
    reward: "$200"
  },
  {
    id: "lost3",
    title: "Lost Diamond Engagement Ring",
    description: "I lost my 1.5-carat diamond engagement ring with a white gold band. It's extremely valuable to me both financially and sentimentally.",
    images: getRandomImages(),
    location: "Maple Street, Springfield",
    postedBy: {
      id: "user3",
      name: "Michael Brown"
    },
    postedDate: new Date(2025, 4, 8),
    isActive: true,
    category: "Jewelry",
    lastSeenDate: new Date(2025, 4, 8),
    reward: "$1000"
  },
];

export const sampleFoundItems: FoundItem[] = [
  {
    id: "found1",
    title: "Found Samsung Galaxy S23",
    description: "Found a Samsung Galaxy S23 with black case near Central Park entrance. The phone is locked but in good condition.",
    images: getRandomImages(),
    location: "Central Park Entrance, New York",
    postedBy: {
      id: "user4",
      name: "Emily Davis"
    },
    postedDate: new Date(2025, 4, 6),
    isActive: true,
    category: "Electronics",
    foundDate: new Date(2025, 4, 6)
  },
  {
    id: "found2",
    title: "Found Car Key with Luxury Fob",
    description: "Found a Mercedes key fob with house keys attached in the library parking lot. Has a distinctive red keychain.",
    images: getRandomImages(),
    location: "Public Library, Main St",
    postedBy: {
      id: "user5",
      name: "David Wilson"
    },
    postedDate: new Date(2025, 4, 8),
    isActive: true,
    category: "Automotive",
    foundDate: new Date(2025, 4, 8)
  },
  {
    id: "found3",
    title: "Found Gold Watch",
    description: "Found an expensive-looking gold watch on Elm Street. It appears to be a luxury brand and is in perfect condition.",
    images: getRandomImages(),
    location: "Elm Street, Springfield",
    postedBy: {
      id: "user6",
      name: "Jessica Miller"
    },
    postedDate: new Date(2025, 4, 7),
    isActive: true,
    category: "Jewelry",
    foundDate: new Date(2025, 4, 7)
  },
];

export const sampleDonationItems: DonationItem[] = [
  {
    id: "donation1",
    title: "Gaming Laptop - Alienware",
    description: "Alienware gaming laptop, 2 years old but still running great. Has 16GB RAM and RTX 3070. Comes with charger and cooling pad.",
    images: getRandomImages(),
    location: "Downtown, Springfield",
    postedBy: {
      id: "user7",
      name: "Robert Taylor"
    },
    postedDate: new Date(2025, 4, 3),
    isActive: true,
    category: "Electronics",
    condition: "Good"
  },
  {
    id: "donation2",
    title: "iPad Pro 12.9-inch (2022)",
    description: "iPad Pro 12.9-inch with Apple Pencil and Magic Keyboard. Barely used, looks brand new. Perfect for students or professionals.",
    images: getRandomImages(),
    location: "Westside, New York",
    postedBy: {
      id: "user8",
      name: "Patricia Anderson"
    },
    postedDate: new Date(2025, 4, 5),
    isActive: true,
    category: "Electronics",
    condition: "Excellent"
  },
  {
    id: "donation3",
    title: "DSLR Camera Kit - Canon EOS",
    description: "Canon EOS DSLR camera with three lenses, tripod, and carrying case. Perfect for photography enthusiasts.",
    images: getRandomImages(),
    location: "Eastside, Springfield",
    postedBy: {
      id: "user9",
      name: "Thomas Martin"
    },
    postedDate: new Date(2025, 4, 4),
    isActive: true,
    category: "Electronics",
    condition: "Good"
  },
];

