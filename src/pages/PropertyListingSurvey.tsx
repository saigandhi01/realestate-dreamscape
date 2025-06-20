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
import { Home, MapPin, Ruler, Bed, Bath, Star, CheckCircle } from 'lucide-react';

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
          {/* Enhanced Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Home className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              List Your Property
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Join thousands of property owners who trust us to showcase their properties. 
              Fill out this comprehensive survey to get your property featured on our premium marketplace.
            </p>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Fast Review Process</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Premium Exposure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Expert Support</span>
              </div>
            </div>
          </div>

          {/* Enhanced Form Card */}
          <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-sm animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Star className="h-6 w-6" />
                Property Listing Survey
              </CardTitle>
              <CardDescription className="text-blue-100">
                Please provide accurate information about your property. Our team will review your submission and contact you within 2-3 business days with next steps.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Step 1: Contact Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-semibold">
                        1
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Full Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              className="h-12 text-base border-2 focus:border-primary transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Email Address *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="your.email@example.com" 
                                className="h-12 text-base border-2 focus:border-primary transition-colors"
                                {...field} 
                              />
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
                            <FormLabel className="text-base font-medium">Phone Number *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+1 (555) 123-4567" 
                                className="h-12 text-base border-2 focus:border-primary transition-colors"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Step 2: Property Type */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-semibold">
                        2
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Property Type
                      </h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Property Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base border-2 focus:border-primary">
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {propertyTypes.map((type) => (
                                <SelectItem key={type} value={type} className="text-base">
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

                  {/* Step 3: Property Location */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-semibold">
                        3
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Property Location
                      </h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="propertyLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Complete Address *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter the complete address including street, city, state, and postal code"
                              className="min-h-[100px] text-base border-2 focus:border-primary transition-colors resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-gray-600">
                            Please provide the full address for accurate property mapping
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Step 4: Area Details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-semibold">
                        4
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Ruler className="h-5 w-5" />
                        Area Details
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="builtUpArea"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Built-up Area *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 1200 sq ft" 
                                className="h-12 text-base border-2 focus:border-primary transition-colors"
                                {...field} 
                              />
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
                            <FormLabel className="text-base font-medium">Land Area *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 2400 sq ft" 
                                className="h-12 text-base border-2 focus:border-primary transition-colors"
                                {...field} 
                              />
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

                  {/* Step 5: Room Configuration & Amenities */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-semibold">
                        5
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Bed className="h-5 w-5" />
                        Room Configuration & Amenities
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium flex items-center gap-2">
                              <Bed className="h-4 w-4" />
                              Number of Bedrooms *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                placeholder="3"
                                className="h-12 text-base border-2 focus:border-primary transition-colors"
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
                            <FormLabel className="text-base font-medium flex items-center gap-2">
                              <Bath className="h-4 w-4" />
                              Number of Bathrooms *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                placeholder="2"
                                className="h-12 text-base border-2 focus:border-primary transition-colors"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormLabel className="text-base font-medium">Available Amenities</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {availableAmenities.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-100 hover:border-primary/50 transition-colors">
                            <Checkbox
                              id={amenity}
                              checked={selectedAmenities.includes(amenity)}
                              onCheckedChange={(checked) => 
                                handleAmenityChange(amenity, checked as boolean)
                              }
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <label 
                              htmlFor={amenity}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
                          <FormLabel className="text-base font-medium">Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Share any special features, recent renovations, unique selling points, or other details that make your property stand out..."
                              className="min-h-[120px] text-base border-2 focus:border-primary transition-colors resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Help us understand what makes your property special. Include details about recent upgrades, neighborhood highlights, or unique features.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-8 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/')}
                      className="flex-1 h-12 text-base border-2 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 h-12 text-base bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Submit Property Listing Request
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Secure & Confidential</h4>
                <p className="text-sm text-gray-600">Your information is protected with enterprise-grade security</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Premium Listings</h4>
                <p className="text-sm text-gray-600">Get maximum exposure on our premium marketplace</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Home className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Expert Support</h4>
                <p className="text-sm text-gray-600">Dedicated team to help you throughout the process</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingSurvey;
