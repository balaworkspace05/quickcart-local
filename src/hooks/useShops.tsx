import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Shop {
  id: string;
  user_id: string;
  name: string;
  logo_url: string | null;
  location: string;
  category: string;
  rating: number | null;
  is_open: boolean | null;
  delivery_time: string | null;
  distance: string | null;
  gpay_qr_url: string | null;
  email: string | null;
  owner_name: string | null;
  created_at: string;
  updated_at: string;
}

export function useShops() {
  return useQuery({
    queryKey: ['shops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      return data as unknown as Shop[];
    },
  });
}

export function useShop(shopId: string) {
  return useQuery({
    queryKey: ['shop', shopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as Shop | null;
    },
    enabled: !!shopId,
  });
}

export function useCreateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shop: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('shops')
        .insert({ ...shop, user_id: user.id } as any)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as Shop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      toast.success('Shop created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create shop');
    },
  });
}

export function useUpdateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Shop> & { id: string }) => {
      const { data, error } = await supabase
        .from('shops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      toast.success('Shop updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update shop');
    },
  });
}
