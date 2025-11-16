-- Security Fix 1: Restrict profiles table to only allow users to view their own profile
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Security Fix 2: Add INSERT and UPDATE policies for payments table
-- Payments should only be created/updated by backend edge functions (service role)
-- These policies prevent any client-side manipulation
CREATE POLICY "Prevent client payment inserts" 
ON public.payments 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Prevent client payment updates" 
ON public.payments 
FOR UPDATE 
USING (false);

-- Security Fix 3: Restrict car_availability management to admins only
DROP POLICY IF EXISTS "System can manage availability" ON public.car_availability;

CREATE POLICY "Only admins can manage availability" 
ON public.car_availability 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update availability" 
ON public.car_availability 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete availability" 
ON public.car_availability 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));