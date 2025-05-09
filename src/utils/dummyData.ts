
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
  "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=400&h=400&fit=crop"
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
    title: "Lost Black Leather Wallet",
    description: "I lost my black leather wallet near Central Park. It contains my ID, credit cards, and some cash.",
    images: getRandomImages(),
    location: "Central Park, New York",
    postedBy: {
      id: "user1",
      name: "John Smith"
    },
    postedDate: new Date(2025, 4, 5),
    isActive: true,
    category: "Personal Items",
    lastSeenDate: new Date(2025, 4, 4),
    reward: "$50"
  },
  {
    id: "lost2",
    title: "Missing White iPhone 13",
    description: "Lost my white iPhone 13 at the coffee shop on Main Street. It has a clear case with flowers on it.",
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
    reward: "$100"
  },
  {
    id: "lost3",
    title: "Lost Golden Retriever - Luna",
    description: "My golden retriever Luna went missing from our backyard. She's friendly and has a blue collar with tags.",
    images: getRandomImages(),
    location: "Maple Street, Springfield",
    postedBy: {
      id: "user3",
      name: "Michael Brown"
    },
    postedDate: new Date(2025, 4, 8),
    isActive: true,
    category: "Pets",
    lastSeenDate: new Date(2025, 4, 8),
    reward: "$200"
  },
];

export const sampleFoundItems: FoundItem[] = [
  {
    id: "found1",
    title: "Found Black Wallet",
    description: "Found a black leather wallet near Central Park entrance. Has IDs and credit cards inside.",
    images: getRandomImages(),
    location: "Central Park Entrance, New York",
    postedBy: {
      id: "user4",
      name: "Emily Davis"
    },
    postedDate: new Date(2025, 4, 6),
    isActive: true,
    category: "Personal Items",
    foundDate: new Date(2025, 4, 6)
  },
  {
    id: "found2",
    title: "Found Car Keys with Honda Remote",
    description: "Found a set of car keys in the library parking lot. Has a Honda remote and several other keys.",
    images: getRandomImages(),
    location: "Public Library, Main St",
    postedBy: {
      id: "user5",
      name: "David Wilson"
    },
    postedDate: new Date(2025, 4, 8),
    isActive: true,
    category: "Personal Items",
    foundDate: new Date(2025, 4, 8)
  },
  {
    id: "found3",
    title: "Found Black Cat",
    description: "Found a friendly black cat with white paws in our neighborhood. No collar but seems well cared for.",
    images: getRandomImages(),
    location: "Elm Street, Springfield",
    postedBy: {
      id: "user6",
      name: "Jessica Miller"
    },
    postedDate: new Date(2025, 4, 7),
    isActive: true,
    category: "Pets",
    foundDate: new Date(2025, 4, 7)
  },
];

export const sampleDonationItems: DonationItem[] = [
  {
    id: "donation1",
    title: "Gently Used Sofa",
    description: "3-seater beige sofa in good condition. Must pick up from my location.",
    images: getRandomImages(),
    location: "Downtown, Springfield",
    postedBy: {
      id: "user7",
      name: "Robert Taylor"
    },
    postedDate: new Date(2025, 4, 3),
    isActive: true,
    category: "Furniture",
    condition: "Good"
  },
  {
    id: "donation2",
    title: "Children's Books Collection",
    description: "Collection of 20+ children's books in excellent condition. Ages 3-10.",
    images: getRandomImages(),
    location: "Westside, New York",
    postedBy: {
      id: "user8",
      name: "Patricia Anderson"
    },
    postedDate: new Date(2025, 4, 5),
    isActive: true,
    category: "Books",
    condition: "Excellent"
  },
  {
    id: "donation3",
    title: "Winter Clothing Bundle",
    description: "Bundle of winter clothes including jackets, sweaters, and accessories. Various sizes.",
    images: getRandomImages(),
    location: "Eastside, Springfield",
    postedBy: {
      id: "user9",
      name: "Thomas Martin"
    },
    postedDate: new Date(2025, 4, 4),
    isActive: true,
    category: "Clothing",
    condition: "Fair to Good"
  },
];
