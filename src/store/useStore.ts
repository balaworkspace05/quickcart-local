import { create } from 'zustand';
import { CartItem, Order, Product, Shop } from '@/data/mockData';

export type UserRole = 'customer' | 'shopkeeper' | 'delivery' | 'admin';

interface AppState {
  // User & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  
  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Notifications
  notifications: string[];
  addNotification: (message: string) => void;
  removeNotification: (index: number) => void;
  
  // UI State
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // User & Role
  currentRole: 'customer',
  setCurrentRole: (role) => set({ currentRole: role }),
  
  // Cart
  cartItems: [],
  addToCart: (product, quantity) => {
    const existingItem = get().cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      set(state => ({
        cartItems: state.cartItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }));
    } else {
      set(state => ({
        cartItems: [...state.cartItems, { product, quantity, shopId: product.shopId }]
      }));
    }
    
    // Add notification for cart wiggle animation trigger
    get().addNotification('Item added to cart!');
  },
  
  removeFromCart: (productId) => {
    set(state => ({
      cartItems: state.cartItems.filter(item => item.product.id !== productId)
    }));
  },
  
  updateCartQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    set(state => ({
      cartItems: state.cartItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    }));
  },
  
  clearCart: () => set({ cartItems: [] }),
  
  getCartTotal: () => {
    return get().cartItems.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  },
  
  getCartItemCount: () => {
    return get().cartItems.reduce((count, item) => count + item.quantity, 0);
  },
  
  // Orders
  orders: [],
  addOrder: (order) => {
    set(state => ({ orders: [order, ...state.orders] }));
  },
  
  updateOrderStatus: (orderId, status) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    }));
  },
  
  // Notifications
  notifications: [],
  addNotification: (message) => {
    set(state => ({ notifications: [...state.notifications, message] }));
    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      set(state => ({ notifications: state.notifications.slice(1) }));
    }, 3000);
  },
  
  removeNotification: (index) => {
    set(state => ({
      notifications: state.notifications.filter((_, i) => i !== index)
    }));
  },
  
  // UI State
  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  
  selectedShop: null,
  setSelectedShop: (shop) => set({ selectedShop: shop }),
}));