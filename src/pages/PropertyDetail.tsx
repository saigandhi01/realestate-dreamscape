
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Building, MapPin, Calendar, FileText, Download, DollarSign, 
  BarChart, ArrowRight, Send, Receipt, Shield, Paperclip
} from 'lucide-react';
import { PageTransition, SlideUp, FadeIn } from '@/components/ui/animations';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePropertyData } from '@/hooks/usePropertyData';
import { useAuth } from '@/contexts/AuthContext';
import { truncateAddress } from '@/utils/wallet';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { properties } = usePropertyData();
  const { isLoggedIn, wallet, openLoginModal } = useAuth();
  
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(1);
  const [recipientAddress, setRecipientAddress] = useState('');
  
  // Find the property by ID
  const property = properties.find(p => p.id === id);
  
  if (!property) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Property Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find the property you're looking for.
            </p>
            <Button asChild>
              <a href="/marketplace">Return to Marketplace</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Calculate funding percentage
  const fundingPercentage = Math.round((property.funded / property.target) * 100);
  
  // Document data
  const documents = [
    {
      id: 'ownership',
      name: 'Ownership Agreement',
      description: 'Legal document outlining ownership terms',
      type: 'PDF',
      size: '1.2MB',
      icon: FileText
    },
    {
      id: 'valuation',
      name: 'Property Valuation Report',
      description: 'Professional valuation of the property',
      type: 'PDF',
      size: '3.5MB',
      icon: Receipt
    },
    {
      id: 'financials',
      name: 'Financial Projections',
      description: 'Projected ROI and financial performance',
      type: 'PDF',
      size: '0.8MB',
      icon: BarChart
    },
    {
      id: 'audit',
      name: 'Smart Contract Audit',
      description: 'Security audit of the property token contract',
      type: 'PDF',
      size: '1.7MB',
      icon: Shield
    },
  ];
  
  // Financials data
  const financials = {
    overview: {
      propertyValue: property.price,
      tokensIssued: property.price / property.tokenPrice,
      rentalYield: 8.2,
      annualAppreciation: 5.4,
      lastDistribution: '2023-11-15',
      nextDistribution: '2023-12-15'
    },
    returns: {
      projectedAnnualReturn: 13.6,
      rentalIncome: 8.2,
      propertyAppreciation: 5.4,
      projectedROI5Years: 89.3,
      projectedROI10Years: 258.7
    }
  };
  
  const handleBuyTokens = () => {
    console.log(`Buying ${tokenAmount} tokens of property ${property.id}`);
    setBuyDialogOpen(false);
  };
  
  const handleSellTokens = () => {
    console.log(`Selling ${tokenAmount} tokens of property ${property.id}`);
    setSellDialogOpen(false);
  };
  
  const handleTransferTokens = () => {
    console.log(`Transferring ${tokenAmount} tokens of property ${property.id} to ${recipientAddress}`);
    setTransferDialogOpen(false);
  };
  
  const downloadDocument = (docId: string) => {
    console.log(`Downloading document: ${docId}`);
    // In a real app, this would trigger a download from S3, IPFS, or similar
  };
  
  return (
    <PageTransition className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative">
          <div className="h-80 md:h-96 w-full overflow-hidden">
            <img 
              src={property.image} 
              alt={property.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-6 md:px-10 relative -mt-40 pb-12">
            <SlideUp>
              <Card className="shadow-lg border-2">
                <CardContent className="p-6 md:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{property.name}</h1>
                      <div className="flex items-center text-muted-foreground mb-6">
                        <MapPin size={16} className="mr-2" />
                        <span>{property.location}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Property Overview</h3>
                          <ul className="space-y-3">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Property Type</span>
                              <span className="font-medium">{property.type}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Token Standard</span>
                              <span className="font-medium">ERC-1155</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Blockchain</span>
                              <span className="font-medium">Ethereum</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Tokenization Date</span>
                              <span className="font-medium">January 15, 2023</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Total Investors</span>
                              <span className="font-medium">{property.investors}</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Token Details</h3>
                          <ul className="space-y-3">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Property Value</span>
                              <span className="font-medium">${property.price.toLocaleString()}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Token Price</span>
                              <span className="font-medium">${property.tokenPrice}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Total Tokens</span>
                              <span className="font-medium">{Math.floor(property.price / property.tokenPrice).toLocaleString()}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Tokens Sold</span>
                              <span className="font-medium">{Math.floor(property.funded / property.tokenPrice).toLocaleString()}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Funding Progress</span>
                              <span className="font-medium">{fundingPercentage}%</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-6">
                      <h3 className="text-lg font-semibold mb-4">Investment Actions</h3>
                      <div className="space-y-4">
                        <Button className="w-full" onClick={() => isLoggedIn ? setBuyDialogOpen(true) : openLoginModal()}>
                          <DollarSign size={16} />
                          Buy Tokens
                        </Button>
                        <Button className="w-full" variant="outline" onClick={() => isLoggedIn ? setSellDialogOpen(true) : openLoginModal()}>
                          <ArrowRight size={16} />
                          Sell Tokens
                        </Button>
                        <Button className="w-full" variant="outline" onClick={() => isLoggedIn ? setTransferDialogOpen(true) : openLoginModal()}>
                          <Send size={16} />
                          Transfer Tokens
                        </Button>
                      </div>
                      
                      {/* Funding Progress */}
                      <div className="mt-8">
                        <div className="flex justify-between text-sm mb-2">
                          <span>${property.funded.toLocaleString()} raised</span>
                          <span className="font-medium">{fundingPercentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${fundingPercentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Target: ${property.target.toLocaleString()}
                        </p>
                      </div>
                      
                      {/* Current User Balance (if logged in) */}
                      {isLoggedIn && (
                        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-2">Your Investment</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Wallet</span>
                              <span className="font-medium">{truncateAddress(wallet.address || '')}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Tokens Owned</span>
                              <span className="font-medium">0</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Ownership</span>
                              <span className="font-medium">0.00%</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          </div>
        </section>
        
        {/* Property Details Tabs */}
        <section className="py-8">
          <div className="container mx-auto px-6 md:px-10">
            <FadeIn>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start mb-8 bg-background border overflow-x-auto hide-scrollbar">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="financials">Financials</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Property Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          Located in the heart of {property.location}, this {property.type.toLowerCase()} property offers an excellent investment opportunity. The property has been tokenized to provide fractional ownership to investors worldwide.
                        </p>
                        <p className="text-muted-foreground mb-4">
                          The property benefits from strong rental demand in the area, with projected annual returns of {financials.overview.rentalYield}% from rental yield alone. Additional returns are expected from property appreciation, which has historically averaged {financials.overview.annualAppreciation}% per year in this neighborhood.
                        </p>
                        <p className="text-muted-foreground">
                          By investing in this property, you receive tokens that represent direct ownership. Rental income is distributed to token holders monthly, in proportion to their ownership stake.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <div className="space-y-8">
                      <Card>
                        <CardHeader>
                          <CardTitle>Property Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Area</span>
                              <span className="font-medium">2,500 sq ft</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Year Built</span>
                              <span className="font-medium">2018</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Current Use</span>
                              <span className="font-medium">Residential Rental</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Occupancy Rate</span>
                              <span className="font-medium">95%</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Property Manager</span>
                              <span className="font-medium">BlockEstate Mgmt</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Location Benefits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Prime location with high demand</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Close to public transportation</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Growing neighborhood with appreciation potential</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Low vacancy rates in the area</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Financials Tab */}
                <TabsContent value="financials" className="pt-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Financial Summary</CardTitle>
                        <CardDescription>Current financial metrics for this property</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          <li className="flex justify-between items-center pb-2 border-b border-border">
                            <span className="text-muted-foreground">Property Value</span>
                            <span className="font-semibold">${financials.overview.propertyValue.toLocaleString()}</span>
                          </li>
                          <li className="flex justify-between items-center pb-2 border-b border-border">
                            <span className="text-muted-foreground">Total Tokens</span>
                            <span className="font-semibold">{financials.overview.tokensIssued.toLocaleString()}</span>
                          </li>
                          <li className="flex justify-between items-center pb-2 border-b border-border">
                            <span className="text-muted-foreground">Annual Rental Yield</span>
                            <span className="font-semibold text-green-600">{financials.overview.rentalYield}%</span>
                          </li>
                          <li className="flex justify-between items-center pb-2 border-b border-border">
                            <span className="text-muted-foreground">Expected Annual Appreciation</span>
                            <span className="font-semibold text-green-600">{financials.overview.annualAppreciation}%</span>
                          </li>
                          <li className="flex justify-between items-center pb-2 border-b border-border">
                            <span className="text-muted-foreground">Last Distribution Date</span>
                            <span className="font-semibold">{financials.overview.lastDistribution}</span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="text-muted-foreground">Next Distribution Date</span>
                            <span className="font-semibold">{financials.overview.nextDistribution}</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Projected Returns</CardTitle>
                        <CardDescription>Expected financial performance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6">
                          <h4 className="font-semibold mb-2">Annual Return Breakdown</h4>
                          <div className="bg-muted p-4 rounded-lg mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm">Rental Income</span>
                              <span className="font-medium">{financials.returns.rentalIncome}%</span>
                            </div>
                            <div className="w-full bg-background rounded-full h-2 mb-4">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${(financials.returns.rentalIncome / financials.returns.projectedAnnualReturn) * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm">Property Appreciation</span>
                              <span className="font-medium">{financials.returns.propertyAppreciation}%</span>
                            </div>
                            <div className="w-full bg-background rounded-full h-2 mb-4">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${(financials.returns.propertyAppreciation / financials.returns.projectedAnnualReturn) * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                              <span className="font-medium">Total Projected Annual Return</span>
                              <span className="font-bold text-green-600">{financials.returns.projectedAnnualReturn}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold mb-4">Long-term Projections</h4>
                        <ul className="space-y-4">
                          <li className="flex justify-between items-center pb-2 border-b border-border">
                            <span className="text-muted-foreground">5-Year ROI</span>
                            <span className="font-semibold text-green-600">{financials.returns.projectedROI5Years}%</span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="text-muted-foreground">10-Year ROI</span>
                            <span className="font-semibold text-green-600">{financials.returns.projectedROI10Years}%</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/30 px-6 py-4">
                        <p className="text-xs text-muted-foreground">
                          Note: These projections are based on historical data and market analysis. Actual returns may vary. Past performance is not indicative of future results.
                        </p>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Documents Tab */}
                <TabsContent value="documents" className="pt-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Property Documents</CardTitle>
                      <CardDescription>Download legal and financial documents related to this property</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documents.map((doc) => (
                          <div 
                            key={doc.id}
                            className="flex items-start p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="mr-4 p-2 bg-primary/10 rounded-lg">
                              <doc.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{doc.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">{doc.type} • {doc.size}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center"
                                  onClick={() => downloadDocument(doc.id)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </FadeIn>
          </div>
        </section>
      </main>
      
      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy Property Tokens</DialogTitle>
            <DialogDescription>
              Purchase tokens for {property.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Number of tokens
              </label>
              <input
                id="amount"
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(parseInt(e.target.value))}
                min={1}
              />
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Price per token</span>
                <span className="text-sm font-medium">${property.tokenPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total cost</span>
                <span className="text-sm font-semibold">${property.tokenPrice * tokenAmount}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm">Your wallet balance</span>
                <span className="text-sm font-medium">{wallet.balance ? `${wallet.balance} ETH` : 'Connect wallet'}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBuyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleBuyTokens}>Buy Tokens</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Sell Dialog */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sell Property Tokens</DialogTitle>
            <DialogDescription>
              Sell your tokens for {property.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="sell-amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Number of tokens to sell
              </label>
              <input
                id="sell-amount"
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(parseInt(e.target.value))}
                min={1}
                max={0} // Would be the user's actual token balance
              />
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Price per token</span>
                <span className="text-sm font-medium">${property.tokenPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total proceeds</span>
                <span className="text-sm font-semibold">${property.tokenPrice * tokenAmount}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm">Your token balance</span>
                <span className="text-sm font-medium">0 tokens</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSellDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSellTokens}>Sell Tokens</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Transfer Dialog */}
      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Property Tokens</DialogTitle>
            <DialogDescription>
              Transfer your tokens for {property.name} to another wallet
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex flex-col space-y-1.5 mb-4">
              <label htmlFor="recipient" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Recipient wallet address
              </label>
              <input
                id="recipient"
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="transfer-amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Number of tokens to transfer
              </label>
              <input
                id="transfer-amount"
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(parseInt(e.target.value))}
                min={1}
                max={0} // Would be the user's actual token balance
              />
            </div>
            
            <div className="mt-4 pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-sm">Your token balance</span>
                <span className="text-sm font-medium">0 tokens</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleTransferTokens}>Transfer Tokens</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </PageTransition>
  );
};

export default PropertyDetail;

