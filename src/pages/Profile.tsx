
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, ShieldCheck, Mail, Phone, Upload, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { isLoggedIn, wallet, disconnect } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: wallet?.address ? `${wallet.address.slice(0, 6)}@tokenized.com` : 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    kycStatus: 'pending' // can be 'pending', 'verified', or 'failed'
  });

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
        toast({
          title: "Profile image updated",
          description: "Your profile picture has been changed successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveChanges = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const startKyc = () => {
    toast({
      title: "KYC verification started",
      description: "You will be guided through the verification process.",
    });
    // In a real app, this would redirect to a KYC verification flow
  };

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* Left column - Profile picture and basic info */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              {profileImage ? (
                <AvatarImage src={profileImage} alt="Profile" />
              ) : (
                <AvatarFallback className="text-4xl">
                  <User size={48} />
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="w-full">
              <Label htmlFor="picture-upload" className="w-full">
                <Button variant="outline" className="w-full mt-2 gap-2">
                  <Upload size={16} />
                  Upload Photo
                </Button>
              </Label>
              <input
                id="picture-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </CardContent>
        </Card>

        {/* Right column - User information */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your personal details</CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" /> Edit
              </Button>
            ) : (
              <Button size="sm" onClick={saveChanges}>
                Save Changes
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name section */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
            </div>

            <Separator />

            {/* Contact information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Mobile Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
            </div>

            <Separator />

            {/* KYC Verification */}
            <div>
              <h3 className="text-lg font-medium mb-4">KYC Verification</h3>
              <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className={`h-6 w-6 ${formData.kycStatus === 'verified' ? 'text-green-500' : 'text-amber-500'}`} />
                  <div>
                    <p className="font-medium">
                      {formData.kycStatus === 'verified' 
                        ? 'Verified' 
                        : formData.kycStatus === 'failed' 
                          ? 'Verification Failed' 
                          : 'Verification Pending'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.kycStatus === 'verified' 
                        ? 'Your identity has been verified' 
                        : formData.kycStatus === 'failed' 
                          ? 'Please check your documents and try again' 
                          : 'Complete KYC to access all features'}
                    </p>
                  </div>
                </div>
                {formData.kycStatus !== 'verified' && (
                  <Button onClick={startKyc}>
                    {formData.kycStatus === 'failed' ? 'Try Again' : 'Complete KYC'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="destructive" onClick={disconnect}>
              Log Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
