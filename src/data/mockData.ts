export interface Shop {
  id: string;
  name: string;
  category: 'grocery' | 'pharmacy' | 'bakery' | 'electronics' | 'clothing';
  logo: string;
  rating: number;
  distance: number;
  isOpen: boolean;
  deliveryTime: string;
  offers?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  shopId: string;
  stock: number;
  unit: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  shopId: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'confirmed' | 'packed' | 'out-for-delivery' | 'delivered';
  orderTime: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  shops: string[];
}

export interface DeliveryOrder extends Order {
  pickupLocation: string;
  dropLocation: string;
  distance: number;
  earnings: number;
}

export const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Fresh Mart Grocery',
    category: 'grocery',
    logo: '🏪',
    rating: 4.5,
    distance: 0.5,
    isOpen: true,
    deliveryTime: '15-30 min',
    offers: '20% off on vegetables'
  },
  {
    id: '2',
    name: 'HealthCare Pharmacy',
    category: 'pharmacy',
    logo: '💊',
    rating: 4.8,
    distance: 0.8,
    isOpen: true,
    deliveryTime: '10-20 min'
  },
  {
    id: '3',
    name: 'Golden Bakery',
    category: 'bakery',
    logo: '🍞',
    rating: 4.6,
    distance: 1.2,
    isOpen: true,
    deliveryTime: '20-35 min',
    offers: 'Buy 2 Get 1 Free'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Bananas',
    price: 40,
    originalPrice: 50,
    image: '🍌',
    category: 'Fruits',
    shopId: '1',
    stock: 25,
    unit: 'per dozen',
    description: 'Fresh organic bananas from local farms'
  },
  {
    id: '2',
    name: 'Whole Wheat Bread',
    price: 35,
    image: '🍞',
    category: 'Bakery',
    shopId: '3',
    stock: 15,
    unit: 'per loaf',
    description: 'Freshly baked whole wheat bread'
  },
  {
    id: '3',
    name: 'Paracetamol 500mg',
    price: 15,
    image: '💊',
    category: 'Medicine',
    shopId: '2',
    stock: 50,
    unit: 'per strip',
    description: 'Pain relief medication - 10 tablets'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerId: 'user1',
    items: [
      { product: mockProducts[0], quantity: 2, shopId: '1' },
      { product: mockProducts[1], quantity: 1, shopId: '3' }
    ],
    totalAmount: 115,
    status: 'out-for-delivery',
    orderTime: '2024-01-15T10:30:00Z',
    estimatedDelivery: '2024-01-15T11:15:00Z',
    deliveryAddress: '123 Main St, Sector 15',
    shops: ['1', '3']
  }
];

export const testimonials = [
  {
    name: 'Priya Sharma',
    rating: 5,
    text: 'Amazing service! Got fresh groceries delivered in just 15 minutes.',
    location: 'Koramangala'
  },
  {
    name: 'Rajesh Kumar',
    rating: 5,
    text: 'Supporting local shops while getting super fast delivery. Perfect!',
    location: 'Indiranagar'
  },
  {
    name: 'Anjali Patel',
    rating: 4,
    text: 'Love the multi-store checkout feature. So convenient!',
    location: 'Whitefield'
  }
];