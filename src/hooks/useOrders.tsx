import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'out-for-delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer_id: string;
  vendor_id: string | null;
  product_id: string | null;
  quantity: number;
  total_price: number;
  status: string;
  payment_mode: string;
  created_at: string;
}

export interface CreateOrderInput {
  customer_id: string;
  vendor_id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  payment_mode?: string;
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get profile id from user
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderInput: CreateOrderInput) => {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: orderInput.customer_id,
          vendor_id: orderInput.vendor_id,
          product_id: orderInput.product_id,
          quantity: orderInput.quantity,
          total_price: orderInput.total_price,
          payment_mode: orderInput.payment_mode || 'cod',
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order placed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to place order');
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status');
    },
  });
}
