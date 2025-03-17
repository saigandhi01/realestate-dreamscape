
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, ShieldCheck, Mail, Phone, Upload, Edit2, Briefcase, ArrowLeftRight, Wallet, TrendingUp, DollarSign, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

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

  // Sample portfolio data
  const [portfolio] = useState([
    { id: 1, name: 'Property NYC Downtown', value: '$125,000', tokens: '5,000', ownership: '12.5%' },
    { id: 2, name: 'Miami Beach Villa', value: '$87,500', tokens: '3,500', ownership: '7.8%' },
    { id: 3, name: 'Chicago Office Complex', value: '$62,000', tokens: '2,480', ownership: '6.2%' },
  ]);

  // Sample transaction data
  const [transactions] = useState([
    { id: 1, date: '2023-05-15', type: 'buy', property: 'Property NYC Downtown', amount: '$25,000', tokens: '1,000' },
    { id: 2, date: '2023-06-22', type: 'sell', property: 'San Francisco Loft', amount: '$18,000', tokens: '720' },
    { id: 3, date: '2023-07-30', type: 'transfer', property: 'Miami Beach Villa', amount: '$12,500', tokens: '500' },
    { id: 4, date: '2023-09-10', type: 'buy', property: 'Chicago Office Complex', amount: '$30,000', tokens: '1,200' },
  ]);

  // Sample investment performance data
  const [investmentData] = useState({
    totalInvested: '$304,500',
    currentValue: '$362,350',
    roi: '18.9%',
    annualYield: '8.2%',
    monthlyIncome: '$2,120'
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

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <DollarSign className="text-green-500" />;
      case 'sell':
        return <DollarSign className="text-red-500" />;
      case 'transfer':
        return <Share className="text-blue-500" />;
      default:
        return <ArrowLeftRight />;
    }
  };

  return (
    <div className="container max-w-6xl py-10">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <Tabs defaultValue="personal" className="w-full space-y-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="investment">Investment Performance</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-8">
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
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" /> My Property Portfolio
                  </CardTitle>
                  <CardDescription>
                    Overview of your property investments and tokens
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All Properties
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Tokens Owned</TableHead>
                    <TableHead>Ownership %</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolio.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.name}</TableCell>
                      <TableCell>{property.value}</TableCell>
                      <TableCell>{property.tokens}</TableCell>
                      <TableCell>{property.ownership}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowLeftRight className="h-5 w-5" /> Transaction History
                  </CardTitle>
                  <CardDescription>
                    History of your property purchases, sales, and transfers
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Export Transactions
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Tokens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          <span className="capitalize">{transaction.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{transaction.property}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.tokens}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Performance Tab */}
        <TabsContent value="investment">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" /> Investment Performance
                  </CardTitle>
                  <CardDescription>
                    Track your ROI and overall investment performance
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Invested</CardDescription>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-blue-500" />
                      {investmentData.totalInvested}
                    </CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Current Value</CardDescription>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      {investmentData.currentValue}
                    </CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Return on Investment</CardDescription>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      {investmentData.roi}
                    </CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Annual Yield</CardDescription>
                    <CardTitle className="text-2xl">
                      {investmentData.annualYield}
                    </CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Monthly Income</CardDescription>
                    <CardTitle className="text-2xl">
                      {investmentData.monthlyIncome}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
