export interface Pet {
  id: string;
  name: string;
  animalType: string;
  breed: string;
  photo: string;
  ownerName: string;
  ownerAddress: string;
  ownerPhone: string;
  ownerEmail: string;
  qrGenerated: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: string;
}

export interface AdoptionPost {
  id: string;
  petName: string;
  animalType: string;
  breed: string;
  age: string;
  description: string;
  location: string;
  photo: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  status: "available" | "adopted";
  createdAt: string;
}

export interface AdoptionRequest {
  id: string;
  adoptionPostId: string;
  petName: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  status: "pending" | "approved" | "processing" | "rejected";
  createdAt: string;
}

export interface Order {
  id: string;
  items: { product: Product; quantity: number }[];
  total: number;
  status: "confirmed" | "processing" | "shipped" | "delivered";
  createdAt: string;
}

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "PetSafety Classic QR Belt",
    description: "Durable nylon belt with embedded QR tag. Adjustable size fits most dogs. Waterproof QR code that lasts years.",
    price: 599,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    category: "Dog Belts",
    rating: 4.5,
    reviews: 234,
    inStock: true,
    badge: "Best Seller",
  },
  {
    id: "p2",
    name: "PetSafety Premium Leather Belt",
    description: "Premium genuine leather belt with stainless steel QR tag. Elegant design for medium to large dogs.",
    price: 1299,
    originalPrice: 1699,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop",
    category: "Dog Belts",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    badge: "Premium",
  },
  {
    id: "p3",
    name: "PetSafety Cat Collar with QR",
    description: "Lightweight, breakaway cat collar with small QR tag. Safe quick-release buckle.",
    price: 449,
    originalPrice: 599,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    category: "Cat Collars",
    rating: 4.3,
    reviews: 189,
    inStock: true,
  },
  {
    id: "p4",
    name: "PetSafety Reflective QR Belt",
    description: "High-visibility reflective belt with QR tag. Perfect for night walks. Available in multiple sizes.",
    price: 799,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=400&fit=crop",
    category: "Dog Belts",
    rating: 4.6,
    reviews: 312,
    inStock: true,
    badge: "Popular",
  },
  {
    id: "p5",
    name: "PetSafety Puppy Starter Kit",
    description: "Includes adjustable puppy belt, QR tag, and pet ID card. Perfect for new puppy owners.",
    price: 899,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    category: "Starter Kits",
    rating: 4.7,
    reviews: 98,
    inStock: true,
    badge: "New",
  },
  {
    id: "p6",
    name: "PetSafety Adventure Belt",
    description: "Extra durable belt for active dogs. Waterproof, scratch-resistant QR tag built to withstand outdoor adventures.",
    price: 1099,
    image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400&h=400&fit=crop",
    category: "Dog Belts",
    rating: 4.4,
    reviews: 67,
    inStock: true,
  },
];

export const mockAdoptionPosts: AdoptionPost[] = [
  {
    id: "a1",
    petName: "Buddy",
    animalType: "Dog",
    breed: "Golden Retriever",
    age: "2 years",
    description: "Friendly and energetic golden retriever looking for a loving forever home. Great with kids and other pets.",
    location: "Mumbai, Maharashtra",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    ownerName: "Rahul Sharma",
    ownerPhone: "+91 98765 43210",
    ownerEmail: "rahul@example.com",
    status: "available",
    createdAt: "2026-03-10",
  },
  {
    id: "a2",
    petName: "Whiskers",
    animalType: "Cat",
    breed: "Persian",
    age: "1 year",
    description: "Beautiful white Persian cat, very calm and affectionate. Loves to cuddle and play with yarn.",
    location: "Delhi, NCR",
    photo: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop",
    ownerName: "Priya Patel",
    ownerPhone: "+91 87654 32109",
    ownerEmail: "priya@example.com",
    status: "available",
    createdAt: "2026-03-12",
  },
  {
    id: "a3",
    petName: "Rocky",
    animalType: "Dog",
    breed: "German Shepherd",
    age: "3 years",
    description: "Well-trained German Shepherd, great guard dog. Needs a home with a yard. Very loyal and protective.",
    location: "Bangalore, Karnataka",
    photo: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop",
    ownerName: "Amit Kumar",
    ownerPhone: "+91 76543 21098",
    ownerEmail: "amit@example.com",
    status: "available",
    createdAt: "2026-03-08",
  },
  {
    id: "a4",
    petName: "Luna",
    animalType: "Cat",
    breed: "Siamese",
    age: "6 months",
    description: "Playful Siamese kitten with stunning blue eyes. Very vocal and loves attention.",
    location: "Pune, Maharashtra",
    photo: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=400&fit=crop",
    ownerName: "Sneha Desai",
    ownerPhone: "+91 65432 10987",
    ownerEmail: "sneha@example.com",
    status: "adopted",
    createdAt: "2026-03-05",
  },
  {
    id: "a5",
    petName: "Max",
    animalType: "Dog",
    breed: "Labrador",
    age: "4 years",
    description: "Gentle and loving Labrador. Great family dog. Trained and vaccinated. Needs a caring home.",
    location: "Chennai, Tamil Nadu",
    photo: "https://images.unsplash.com/photo-1529429617124-95b109e86bb8?w=400&h=400&fit=crop",
    ownerName: "Karthik Rajan",
    ownerPhone: "+91 54321 09876",
    ownerEmail: "karthik@example.com",
    status: "available",
    createdAt: "2026-03-14",
  },
  {
    id: "a6",
    petName: "Coco",
    animalType: "Dog",
    breed: "Pomeranian",
    age: "1.5 years",
    description: "Adorable fluffy Pomeranian. Very friendly and loves walks. Perfect for apartment living.",
    location: "Hyderabad, Telangana",
    photo: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop",
    ownerName: "Deepa Reddy",
    ownerPhone: "+91 43210 98765",
    ownerEmail: "deepa@example.com",
    status: "available",
    createdAt: "2026-03-15",
  },
];
