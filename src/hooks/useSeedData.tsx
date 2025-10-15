import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useSeedData() {
  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user has shopkeeper role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!roleData || roleData.role !== 'shopkeeper') {
        // Add shopkeeper role if not present
        await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: 'shopkeeper' });
      }

      // Create sample shops
      const shops = [
        {
          owner_id: user.id,
          name: "Fresh Mart Grocery",
          location: "Sector 14, Gurgaon",
          category: "Grocery",
          rating: 4.5,
          is_open: true,
          delivery_time: "20-30 mins",
          distance: "1.2 km",
          logo_url: "🛒",
        },
        {
          owner_id: user.id,
          name: "MediCare Pharmacy",
          location: "MG Road, Gurgaon",
          category: "Pharmacy",
          rating: 4.8,
          is_open: true,
          delivery_time: "15-25 mins",
          distance: "0.8 km",
          logo_url: "💊",
        },
        {
          owner_id: user.id,
          name: "Baker's Delight",
          location: "DLF Phase 2",
          category: "Bakery",
          rating: 4.6,
          is_open: true,
          delivery_time: "25-35 mins",
          distance: "2.1 km",
          logo_url: "🍞",
        },
      ];

      const { data: createdShops, error: shopsError } = await supabase
        .from('shops')
        .insert(shops)
        .select();

      if (shopsError) throw shopsError;

      // Create sample products for each shop
      if (createdShops) {
        const products = [
          // Fresh Mart Grocery
          {
            shop_id: createdShops[0].id,
            name: "Fresh Milk",
            description: "Full cream fresh milk",
            price: 60,
            original_price: 65,
            stock: 50,
            category: "Dairy",
            unit: "1L",
            is_available: true,
            image_url: "🥛",
          },
          {
            shop_id: createdShops[0].id,
            name: "Whole Wheat Bread",
            description: "Healthy whole wheat bread",
            price: 40,
            stock: 30,
            category: "Bakery",
            unit: "400g",
            is_available: true,
            image_url: "🍞",
          },
          {
            shop_id: createdShops[0].id,
            name: "Farm Fresh Eggs",
            description: "Free range eggs",
            price: 80,
            original_price: 90,
            stock: 20,
            category: "Dairy",
            unit: "12 pcs",
            is_available: true,
            image_url: "🥚",
          },
          // MediCare Pharmacy
          {
            shop_id: createdShops[1].id,
            name: "Paracetamol 500mg",
            description: "Pain relief tablets",
            price: 20,
            stock: 100,
            category: "Medicine",
            unit: "10 tablets",
            is_available: true,
            image_url: "💊",
          },
          {
            shop_id: createdShops[1].id,
            name: "Hand Sanitizer",
            description: "70% alcohol",
            price: 80,
            stock: 50,
            category: "Health",
            unit: "500ml",
            is_available: true,
            image_url: "🧴",
          },
          // Baker's Delight
          {
            shop_id: createdShops[2].id,
            name: "Chocolate Cake",
            description: "Rich chocolate cake",
            price: 350,
            original_price: 400,
            stock: 10,
            category: "Cakes",
            unit: "500g",
            is_available: true,
            image_url: "🎂",
          },
          {
            shop_id: createdShops[2].id,
            name: "Croissant",
            description: "Butter croissant",
            price: 50,
            stock: 25,
            category: "Pastries",
            unit: "2 pcs",
            is_available: true,
            image_url: "🥐",
          },
        ];

        const { error: productsError } = await supabase
          .from('products')
          .insert(products);

        if (productsError) throw productsError;
      }

      return { shops: createdShops };
    },
    onSuccess: () => {
      toast.success('Sample data created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create sample data');
    },
  });
}
