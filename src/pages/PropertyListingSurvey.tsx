
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  propertyType: z.string().min(1, 'Please select a property type'),
  propertyLocation: z.string().min(5, 'Property location must be at least 5 characters'),
  builtUpArea: z.string().min(1, 'Built-up area is required'),
  landArea: z.string().min(1, 'Land area is required'),
  bedrooms: z.number().min(1, 'At least 1 bedroom is required'),
  bathrooms: z.number().min(1, 'At least 1 bathroom is required'),
  amenities: z.array(z.string()),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const availableAmenities = [
  'Swimming Pool',
  'Gym/Fitness Center',
  'Parking',
  'Security',
  'Garden/Landscaping',
  'Balcony/Terrace',
  'Air Conditioning',
  'Elevator',
  'Power Backup',
  'Water Supply',
  'Internet/WiFi',
  'Club House',
  'Children Play Area',
  'Shopping Complex',
];

const propertyTypes = [
  'Apartment',
  'Villa',
  'Independent House',
  'Townhouse',
  'Penthouse',
  'Studio Apartment',
  'Duplex',
  'Commercial Space',
  'Office Space',
  'Shop/Retail',
  'Warehouse',
  'Plot/Land',
];

const PropertyListingSurvey = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      propertyType: '',
      propertyLocation: '',
      builtUpArea: '',
      landArea: '',
      bedrooms: 1,
      bathrooms: 1,
      amenities: [],
      additionalNotes: '',
    },
  });

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities(prev => [...prev, amenity]);
    } else {
      setSelectedAmenities(prev => prev.filter(a => a !== amenity));
    }
    form.setValue('amenities', selectedAmenities);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Check if user ID is a valid UUID format, if not set to null
      let userId = null;
      if (user?.id) {
        // Simple UUID format check (36 characters with dashes)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(user.id)) {
          userId = user.id;
        }
      }

      const surveyData = {
        full_name: data.fullName,
        email: data.email,
        phone_number: data.phoneNumber,
        property_type: data.propertyType,
        property_location: data.propertyLocation,
        built_up_area: data.builtUpArea,
        land_area: data.landArea,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        amenities: selectedAmenities,
        additional_notes: data.additionalNotes || null,
        user_id: userId,
      };

      console.log('Submitting survey data:', surveyData);

      const { error } = await supabase
        .from('property_listing_surveys')
        .insert([surveyData]);

      if (error) {
        console.error('Error submitting survey:', error);
        toast({
          title: 'Error',
          description: 'Failed to submit your property listing request. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success!',
        description: 'Your property listing request has been submitted successfully. We will contact you soon.',
      });

      // Redirect to home page after successful submission
      navigate('/');
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              List Your Property
            </h1>
            <p className="text-xl text-gray-600">
              Fill out this survey to get your property listed on our marketplace
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Property Listing Survey</CardTitle>
              <CardDescription>
                Please provide accurate information about your property. We will review your submission and contact you within 2-3 business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">1. Contact Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">2. Property Type</h3>
                    
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {propertyTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Property Location */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">3. Property Location</h3>
                    
                    <FormField
                      control={form.control}
                      name="propertyLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complete Address *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter the complete address including city, state, and postal code"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Area Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">4. Area Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="builtUpArea"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Built-up Area *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 1200 sq ft" {...field} />
                            </FormControl>
                            <FormDescription>
                              Include unit (sq ft, sq m, etc.)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="landArea"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Land Area *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2400 sq ft" {...field} />
                            </FormControl>
                            <FormDescription>
                              Include unit (sq ft, sq m, etc.)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">5. Room Configuration & Amenities</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Bedrooms *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                placeholder="3"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bathrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Bathrooms *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                placeholder="2"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-3">
                      <FormLabel>Amenities</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableAmenities.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox
                              id={amenity}
                              checked={selectedAmenities.includes(amenity)}
                              onCheckedChange={(checked) => 
                                handleAmenityChange(amenity, checked as boolean)
                              }
                            />
                            <label 
                              htmlFor={amenity}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any additional information about your property..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Include any special features, recent renovations, or other details that might be relevant.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/')}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Property Listing Request'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingSurvey;
