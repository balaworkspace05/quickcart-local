import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Shop {
  id: string;
  user_id: string;
  shop_name: string;
  owner_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
  gpay_qr_url: string | null;
  created_at: string;
}

export function useShops() {
  return useQuery({
    queryKey: ['shops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('shop_name', { ascending: true });

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
        .from('vendors')
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
    mutationFn: async (shop: Omit<Shop, 'id' | 'created_at' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get profile id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data, error } = await supabase
        .from('vendors')
        .insert({ ...shop, user_id: profile.id } as any)
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
        .from('vendors')
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
