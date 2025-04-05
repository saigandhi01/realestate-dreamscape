import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, ShieldCheck, Mail, Phone, Upload, Edit2, Briefcase, ArrowLeftRight, Wallet, TrendingUp, DollarSign, Share, ChevronRight, Building, Home, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { transactionToast } from '@/components/ui/transaction-toast';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import WalletConnectionSection from '@/components/WalletConnectionSection';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
} from '@/components/ui/chart';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  Tooltip
} from 'recharts';

const Profile = () => {
  const { isLoggedIn, wallet, disconnect, needsWalletConnection } = useAuth();
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

  const [portfolio] = useState([
    { id: 1, name: 'Property NYC Downtown', value: '$125,000', tokens: '5,000', ownership: '12.5%', type: 'residential', progress: 87 },
    { id: 2, name: 'Miami Beach Villa', value: '$87,500', tokens: '3,500', ownership: '7.8%', type: 'vacation', progress: 62 },
    { id: 3, name: 'Chicago Office Complex', value: '$62,000', tokens: '2,480', ownership: '6.2%', type: 'commercial', progress: 45 },
  ]);

  const [transactions] = useState([
    { id: 1, date: '2023-05-15', type: 'buy', property: 'Property NYC Downtown', amount: '$25,000', tokens: '1,000' },
    { id: 2, date: '2023-06-22', type: 'sell', property: 'San Francisco Loft', amount: '$18,000', tokens: '720' },
    { id: 3, date: '2023-07-30', type: 'transfer', property: 'Miami Beach Villa', amount: '$12,500', tokens: '500' },
    { id: 4, date: '2023-09-10', type: 'buy', property: 'Chicago Office Complex', amount: '$30,000', tokens: '1,200' },
  ]);

  const [investmentData] = useState({
    totalInvested: '$304,500',
    currentValue: '$362,350',
    roi: '18.9%',
    annualYield: '8.2%',
    monthlyIncome: '$2,120'
  });

  const [performanceData] = useState([
    { month: 'Jan', value: 120000, prev: 100000 },
    { month: 'Feb', value: 150000, prev: 110000 },
    { month: 'Mar', value: 180000, prev: 130000 },
    { month: 'Apr', value: 220000, prev: 150000 },
    { month: 'May', value: 250000, prev: 190000 },
    { month: 'Jun', value: 280000, prev: 210000 },
    { month: 'Jul', value: 310000, prev: 230000 },
    { month: 'Aug', value: 330000, prev: 260000 },
    { month: 'Sep', value: 362350, prev: 304500 },
  ]);

  const [portfolioDistribution] = useState([
    { name: 'Residential', value: 45 },
    { name: 'Commercial', value: 30 },
    { name: 'Vacation', value: 25 },
  ]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      if (file.size > 5 * 1024 * 1024) {
        transactionToast({
          title: "Upload failed",
          description: "Image size should be less than 5MB.",
          status: "error"
        });
        setIsUploading(false);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        transactionToast({
          title: "Upload failed",
          description: "Only image files are allowed.",
          status: "error"
        });
        setIsUploading(false);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
        setIsUploading(false);
        transactionToast({
          title: "Profile image updated",
          description: "Your profile picture has been uploaded successfully.",
          status: "success"
        });
      };
      
      reader.onerror = () => {
        setIsUploading(false);
        transactionToast({
          title: "Upload failed",
          description: "Failed to read the image file. Please try again.",
          status: "error"
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

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'residential':
        return <Home className="h-5 w-5 text-blue-500" />;
      case 'commercial':
        return <Building className="h-5 w-5 text-purple-500" />;
      case 'vacation':
        return <Building className="h-5 w-5 text-amber-500" />;
      default:
        return <Building className="h-5 w-5" />;
    }
  };

  const chartConfig = {
    value: {
      label: "Current Value",
      theme: {
        light: "#0088FE",
        dark: "#4F46E5",
      },
    },
    prev: {
      label: "Investment",
      theme: {
        light: "#00C49F",
        dark: "#10B981",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="container max-w-6xl py-10">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        {needsWalletConnection && (
          <div className="mb-8">
            <WalletConnectionSection />
          </div>
        )}
        
        <Tabs defaultValue="personal" className="w-full space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="investment">Investment Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="md:col-span-1 bg-card/70 backdrop-blur-sm border-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-xl">
                    {profileImage ? (
                      <AvatarImage src={profileImage} alt="Profile" />
                    ) : (
                      <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/20 to-primary/30">
                        <User size={48} />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 gap-2"
                      onClick={handleUploadButtonClick}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                          Uploading...
                        </span>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload Photo
                        </>
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      id="picture-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 bg-card/70 backdrop-blur-sm border-primary/10 shadow-lg">
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

                  {wallet.connected && (
                    <>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <Wallet className="h-5 w-5" /> 
                          Wallet Information
                        </h3>
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">Wallet Address</p>
                            <p className="text-sm font-mono">{wallet.address}</p>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">Network</p>
                            <p className="text-sm">{wallet.networkName}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="font-medium">Balance</p>
                            <p className="text-sm">{wallet.balance ? `${parseFloat(wallet.balance).toFixed(4)} ETH` : '0 ETH'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                    </>
                  )}

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

          <TabsContent value="portfolio">
            <Card className="bg-card/70 backdrop-blur-sm border-primary/10 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
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
              <CardContent className="p-0">
                <div className="p-6 grid gap-6 md:grid-cols-3">
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium mb-4">Portfolio Distribution</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={portfolioDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {portfolioDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Portfolio Summary</h3>
                    <div className="space-y-4">
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <p className="text-muted-foreground">Total Properties</p>
                        <p className="text-2xl font-semibold">{portfolio.length}</p>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <p className="text-muted-foreground">Total Value</p>
                        <p className="text-2xl font-semibold">$274,500</p>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <p className="text-muted-foreground">Total Tokens</p>
                        <p className="text-2xl font-semibold">10,980</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Tokens Owned</TableHead>
                      <TableHead>Ownership %</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio.map((property) => (
                      <TableRow key={property.id} className="hover:bg-primary/5">
                        <TableCell className="font-medium">{property.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPropertyIcon(property.type)}
                            <span className="capitalize">{property.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{property.value}</TableCell>
                        <TableCell>{property.tokens}</TableCell>
                        <TableCell>{property.ownership}</TableCell>
                        <TableCell className="w-32">
                          <div className="flex items-center gap-2">
                            <Progress value={property.progress} className="h-2" />
                            <span className="text-xs">{property.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="gap-1">
                            View Details <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="bg-card/70 backdrop-blur-sm border-primary/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
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
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="h-64 mb-6">
                    <h3 className="text-lg font-medium mb-4">Transaction Activity</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { month: 'Apr', buy: 2, sell: 1, transfer: 0 },
                          { month: 'May', buy: 1, sell: 0, transfer: 1 },
                          { month: 'Jun', buy: 3, sell: 2, transfer: 0 },
                          { month: 'Jul', buy: 0, sell: 1, transfer: 2 },
                          { month: 'Aug', buy: 4, sell: 0, transfer: 1 },
                          { month: 'Sep', buy: 2, sell: 2, transfer: 3 },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="buy" stackId="a" fill="#0088FE" name="Buy" />
                        <Bar dataKey="sell" stackId="a" fill="#FF8042" name="Sell" />
                        <Bar dataKey="transfer" stackId="a" fill="#00C49F" name="Transfer" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-primary/5">
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTransactionIcon(transaction.type)}
                            <span className={`capitalize font-medium ${
                              transaction.type === 'buy' 
                                ? 'text-green-600' 
                                : transaction.type === 'sell' 
                                  ? 'text-red-600' 
                                  : 'text-blue-600'
                            }`}>
                              {transaction.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{transaction.property}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>{transaction.tokens}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investment">
            <Card className="bg-card/70 backdrop-blur-sm border-primary/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" /> Investment Performance
                    </CardTitle>
                    <CardDescription>
                      Track your ROI and overall investment performance
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <BarChart2 className="h-4 w-4" /> Chart View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <BarChart2 className="h-4 w-4" /> Comparison View
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-0 shadow">
                    <CardHeader className="pb-2">
                      <CardDescription>Total Invested</CardDescription>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-blue-500" />
                        {investmentData.totalInvested}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-0 shadow">
                    <CardHeader className="pb-2">
                      <CardDescription>Current Value</CardDescription>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        {investmentData.currentValue}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-0 shadow">
                    <CardHeader className="pb-2">
                      <CardDescription>Return on Investment</CardDescription>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        {investmentData.roi}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Investment Growth Over Time</h3>
                  <div className="h-72 w-full">
                    <ChartContainer
                      config={chartConfig}
                      className="h-full"
                    >
                      <AreaChart
                        data={performanceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `$${value/1000}k`}
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent labelFormatter={(label) => `Month: ${label}`} />}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          name="value"
                          stroke="var(--color-value)" 
                          fill="var(--color-value)" 
                          fillOpacity={0.1} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="prev" 
                          name="prev"
                          stroke="var(--color-prev)" 
                          fill="var(--color-prev)" 
                          fillOpacity={0.1} 
                        />
                        <ChartLegend 
                          content={<ChartLegendContent />} 
                          verticalAlign="top" 
                          align="right"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="shadow-sm border-primary/5">
                    <CardHeader className="pb-2">
                      <CardDescription>Annual Yield</CardDescription>
                      <CardTitle className="text-2xl">{investmentData.annualYield}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={100}>
                        <LineChart data={[
                          { month: 'Apr', yield: 6.2 },
                          { month: 'May', yield: 6.8 },
                          { month: 'Jun', yield: 7.1 },
                          { month: 'Jul', yield: 7.4 },
                          { month: 'Aug', yield: 7.9 },
                          { month: 'Sep', yield: 8.2 },
                        ]}>
                          <Line type="monotone" dataKey="yield" stroke="#8884d8" strokeWidth={2} dot={false} />
                          <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                          <XAxis dataKey="month" hide />
                          <Tooltip formatter={(value) => [`${value}%`, 'Yield']} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm border-primary/5">
                    <CardHeader className="pb-2">
                      <CardDescription>Monthly Income</CardDescription>
                      <CardTitle className="text-2xl">{investmentData.monthlyIncome}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={100}>
                        <LineChart data={[
                          { month: 'Apr', income: 1600 },
                          { month: 'May', income: 1750 },
                          { month: 'Jun', income: 1800 },
                          { month: 'Jul', income: 1950 },
                          { month: 'Aug', income: 2050 },
                          { month: 'Sep', income: 2120 },
                        ]}>
                          <Line type="monotone" dataKey="income" stroke="#82ca9d" strokeWidth={2} dot={false} />
                          <YAxis domain={['dataMin - 200', 'dataMax + 200']} hide />
                          <XAxis dataKey="month" hide />
                          <Tooltip formatter={(value) => [`$${value}`, 'Income']} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
