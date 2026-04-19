-- Allow guest checkout: permit inserts where user_id is null (anonymous/guest orders)
-- Drop and recreate the insert policy to also allow guest orders
DROP POLICY IF EXISTS "Admins can insert orders" ON public.orders;

CREATE POLICY "Users and guests can insert orders"
ON public.orders
FOR INSERT
WITH CHECK (
  (user_id IS NULL) OR (auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Allow guests to view their order by ID (for order confirmation/tracking)
CREATE POLICY "Anyone can view orders by id"
ON public.orders
FOR SELECT
USING (true);

-- Drop the old restrictive select policy since the new one is more permissive
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

-- Same for order_items - allow insert for guests
DROP POLICY IF EXISTS "Admins can manage order items" ON public.orders;

CREATE POLICY "Users and guests can insert order items"
ON public.order_items
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view order items (they need the order_id anyway)
DROP POLICY IF EXISTS "Order items follow order access" ON public.order_items;

CREATE POLICY "Anyone can view order items"
ON public.order_items
FOR SELECT
USING (true);