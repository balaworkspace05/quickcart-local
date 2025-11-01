import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Coupon {
  id: string;
  code: string;
  discount_pct: number;
  min_amount: number;
  valid_from: string;
  valid_to: string | null;
  usage_limit: number | null;
  usage_count: number;
  active: boolean;
  created_at: string;
}

export interface CouponValidationResult {
  valid: boolean;
  discount_amount: number;
  message: string;
}

export async function validateAndApplyCoupon(
  couponCode: string,
  orderAmount: number
): Promise<CouponValidationResult> {
  try {
    const { data, error } = await (supabase.rpc as any)('apply_coupon_discount', {
      coupon_code_param: couponCode.toUpperCase(),
      order_amount: orderAmount,
    });

    if (error) throw error;

    const result = data[0];
    
    if (result.valid) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    return result;
  } catch (error: any) {
    toast.error(error.message || 'Failed to validate coupon');
    return {
      valid: false,
      discount_amount: 0,
      message: 'Failed to validate coupon',
    };
  }
}

export async function getCoupon(code: string): Promise<Coupon | null> {
  try {
    const { data, error } = await supabase
      .from('coupons' as any)
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .maybeSingle();

    if (error) throw error;
    return data as unknown as Coupon | null;
  } catch (error) {
    return null;
  }
}
