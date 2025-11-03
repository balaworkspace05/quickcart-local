import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Helper to upload placeholder image to storage
const uploadPlaceholderImage = async (bucket: string, path: string, color: string) => {
  // Create a simple SVG placeholder
  const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="${color}"/>
    <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-family="Arial">
      ${path.split('/')[0]}
    </text>
  </svg>`;
  
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const file = new File([blob], path, { type: 'image/svg+xml' });
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);
  
  return publicUrl;
};

export function useSeedData() {
  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get profile id from user
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      // Check if user has shopkeeper role, if not update it
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', profile.id)
        .single();

      if (!profileData || profileData.role !== 'vendor') {
        // Update profile role to vendor/shopkeeper
        await supabase
          .from('profiles')
          .update({ role: 'vendor' })
          .eq('id', profile.id);
      }

      // Upload vendor logos
      const groceryLogo = await uploadPlaceholderImage('shop-images', 'grocery-logo.svg', '#10b981');
      const pharmacyLogo = await uploadPlaceholderImage('shop-images', 'pharmacy-logo.svg', '#3b82f6');
      const bakeryLogo = await uploadPlaceholderImage('shop-images', 'bakery-logo.svg', '#f59e0b');

      // Create sample vendors
      const vendors = [
        {
          user_id: profile.id,
          shop_name: "Fresh Mart Grocery",
          owner_name: user.email?.split('@')[0] || 'Owner',
          email: user.email,
          phone: '+911234567890',
          address: "Sector 14, Gurgaon",
          logo_url: groceryLogo,
        },
        {
          user_id: profile.id,
          shop_name: "MediCare Pharmacy",
          owner_name: user.email?.split('@')[0] || 'Owner',
          email: user.email,
          phone: '+911234567891',
          address: "MG Road, Gurgaon",
          logo_url: pharmacyLogo,
        },
        {
          user_id: profile.id,
          shop_name: "Baker's Delight",
          owner_name: user.email?.split('@')[0] || 'Owner',
          email: user.email,
          phone: '+911234567892',
          address: "DLF Phase 2",
          logo_url: bakeryLogo,
        },
      ];

      const { data: createdVendors, error: vendorsError } = await supabase
        .from('vendors')
        .insert(vendors)
        .select();

      if (vendorsError) throw vendorsError;

      // Create sample products for each vendor
      if (createdVendors) {
        // Upload product images
        const milkImage = await uploadPlaceholderImage('product-images', 'milk.svg', '#e0f2fe');
        const breadImage = await uploadPlaceholderImage('product-images', 'bread.svg', '#fed7aa');
        const eggsImage = await uploadPlaceholderImage('product-images', 'eggs.svg', '#fef3c7');
        const medicineImage = await uploadPlaceholderImage('product-images', 'medicine.svg', '#dbeafe');
        const sanitizerImage = await uploadPlaceholderImage('product-images', 'sanitizer.svg', '#e0e7ff');
        const cakeImage = await uploadPlaceholderImage('product-images', 'cake.svg', '#ffe4e6');
        const croissantImage = await uploadPlaceholderImage('product-images', 'croissant.svg', '#fef9c3');

        const products = [
          // Fresh Mart Grocery
          {
            vendor_id: createdVendors[0].id,
            name: "Fresh Milk",
            description: "Full cream fresh milk",
            price: 60,
            original_price: 65,
            stock: 50,
            category: "Dairy",
            unit: "1L",
            in_stock: true,
            image_url: milkImage,
          },
          {
            vendor_id: createdVendors[0].id,
            name: "Whole Wheat Bread",
            description: "Healthy whole wheat bread",
            price: 40,
            stock: 30,
            category: "Bakery",
            unit: "400g",
            in_stock: true,
            image_url: breadImage,
          },
          {
            vendor_id: createdVendors[0].id,
            name: "Farm Fresh Eggs",
            description: "Free range eggs",
            price: 80,
            original_price: 90,
            stock: 20,
            category: "Dairy",
            unit: "12 pcs",
            in_stock: true,
            image_url: eggsImage,
          },
          // MediCare Pharmacy
          {
            vendor_id: createdVendors[1].id,
            name: "Paracetamol 500mg",
            description: "Pain relief tablets",
            price: 20,
            stock: 100,
            category: "Medicine",
            unit: "10 tablets",
            in_stock: true,
            image_url: medicineImage,
          },
          {
            vendor_id: createdVendors[1].id,
            name: "Hand Sanitizer",
            description: "70% alcohol",
            price: 80,
            stock: 50,
            category: "Health",
            unit: "500ml",
            in_stock: true,
            image_url: sanitizerImage,
          },
          // Baker's Delight
          {
            vendor_id: createdVendors[2].id,
            name: "Chocolate Cake",
            description: "Rich chocolate cake",
            price: 350,
            original_price: 400,
            stock: 10,
            category: "Cakes",
            unit: "500g",
            in_stock: true,
            image_url: cakeImage,
          },
          {
            vendor_id: createdVendors[2].id,
            name: "Croissant",
            description: "Butter croissant",
            price: 50,
            stock: 25,
            category: "Pastries",
            unit: "2 pcs",
            in_stock: true,
            image_url: croissantImage,
          },
        ];

        const { error: productsError } = await supabase
          .from('products')
          .insert(products);

        if (productsError) throw productsError;
      }

      return { vendors: createdVendors };
    },
    onSuccess: () => {
      toast.success('Sample data created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create sample data');
    },
  });
}
