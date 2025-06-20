
-- Create a table for property listing survey responses
CREATE TABLE public.property_listing_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  property_type TEXT NOT NULL,
  property_location TEXT NOT NULL,
  built_up_area TEXT NOT NULL,
  land_area TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  additional_notes TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to protect user data
ALTER TABLE public.property_listing_surveys ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
CREATE POLICY "Anyone can insert property listing surveys" 
  ON public.property_listing_surveys 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for admins to view all surveys (you can modify this based on your admin setup)
CREATE POLICY "Admins can view all property listing surveys" 
  ON public.property_listing_surveys 
  FOR SELECT 
  USING (true);

-- Create policy for users to view their own surveys
CREATE POLICY "Users can view their own property listing surveys" 
  ON public.property_listing_surveys 
  FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);
