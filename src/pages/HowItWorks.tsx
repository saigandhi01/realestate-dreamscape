
import React from 'react';
import { Building2, Wallet, Coins, ArrowRight, Landmark, BarChart3, Globe2, Layers, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const HowItWorks = () => {
  const { isLoggedIn, openLoginModal } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              How <span className="text-primary">TokenEstate</span> Works
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-muted-foreground">
              Learn how our platform makes real estate investment accessible through blockchain technology
            </p>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">The Investment Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-background shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-6">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Browse Properties</h3>
                <p className="text-muted-foreground mb-4">
                  Explore our curated selection of high-quality real estate investments on our marketplace.
                </p>
                <Button variant="outline" onClick={() => navigate('/marketplace')} className="w-full">
                  View Marketplace <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-background shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-6">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground mb-4">
                  Link your crypto wallet to purchase property tokens using ETH, BTC, USDT, or USDC.
                </p>
                {!isLoggedIn ? (
                  <Button variant="outline" onClick={openLoginModal} className="w-full">
                    Connect Wallet <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="w-full bg-green-50">
                    Wallet Connected <span className="ml-2">✓</span>
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-background shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-6">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Invest & Earn</h3>
                <p className="text-muted-foreground mb-4">
                  Purchase tokens representing property ownership and receive regular rental income distributions.
                </p>
                <Button variant="outline" onClick={() => navigate('/marketplace')} className="w-full">
                  Start Investing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Buy Property */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-6">How to Buy Property from the Marketplace</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            Our platform simplifies the process of investing in real estate through tokenization.
            Follow these steps to purchase your first property tokens.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mr-4">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Connect Your Crypto Wallet</h3>
                <p className="text-muted-foreground">
                  Click the "Connect Wallet" button in the navigation bar and select your preferred wallet provider 
                  (MetaMask, WalletConnect, etc.). Follow the authentication steps to connect your wallet to TokenEstate.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mr-4">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Browse Available Properties</h3>
                <p className="text-muted-foreground">
                  Visit our marketplace to explore curated properties. Use filters to narrow down options based on 
                  location, property type, price range, and expected returns.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mr-4">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Select a Property & Review Details</h3>
                <p className="text-muted-foreground">
                  Click on a property to view detailed information including photos, financial projections, 
                  location details, and token availability. Review all information before proceeding.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mr-4">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Purchase Property Tokens</h3>
                <p className="text-muted-foreground">
                  Choose how many tokens you want to purchase and complete the transaction. Pay using one of our 
                  supported cryptocurrencies: ETH, BTC, USDT, or USDC.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mr-4">
                5
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Confirm & Receive Tokens</h3>
                <p className="text-muted-foreground">
                  Approve the transaction in your wallet. Once confirmed on the blockchain, your property 
                  tokens will appear in your connected wallet and on your TokenEstate dashboard.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mr-4">
                6
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Track Your Investment</h3>
                <p className="text-muted-foreground">
                  Monitor the performance of your investment through your dashboard. Receive rental income 
                  distributions automatically sent to your wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Supported Cryptocurrencies */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-6">Supported Cryptocurrencies</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            TokenEstate supports multiple cryptocurrencies for property token purchases, providing flexibility for investors.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="bg-background border-2 border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.5 13.5L9 10.5H15L16.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.5 13.5H16.5L15 16.5H9L7.5 13.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 10.5L12 7.5L15 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-1">Ethereum (ETH)</h3>
                <p className="text-muted-foreground">
                  Native currency of the Ethereum blockchain
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-2 border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 12L12 8L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-1">Bitcoin (BTC)</h3>
                <p className="text-muted-foreground">
                  The original and most valuable cryptocurrency
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-2 border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-1">USDT (Tether)</h3>
                <p className="text-muted-foreground">
                  Stablecoin pegged to the US dollar
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-2 border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 14.5C8 14.5 9.5 16.5 12 16.5C14.5 16.5 16 14.5 16 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16.5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.5 9.5C8.5 10.3284 7.82843 11 7 11C6.17157 11 5.5 10.3284 5.5 9.5C5.5 8.67157 6.17157 8 7 8C7.82843 8 8.5 8.67157 8.5 9.5Z" fill="currentColor"/>
                    <path d="M18.5 9.5C18.5 10.3284 17.8284 11 17 11C16.1716 11 15.5 10.3284 15.5 9.5C15.5 8.67157 16.1716 8 17 8C17.8284 8 18.5 8.67157 18.5 9.5Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-1">USDC (USD Coin)</h3>
                <p className="text-muted-foreground">
                  Fully reserved stablecoin backed by US dollars
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Access</h3>
              <p className="text-muted-foreground">
                Invest in properties worldwide without geographical restrictions
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fractional Ownership</h3>
              <p className="text-muted-foreground">
                Own a portion of premium real estate with minimal capital investment
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Landmark className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Liquidity</h3>
              <p className="text-muted-foreground">
                Trade your property tokens anytime on secondary markets
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Passive Income</h3>
              <p className="text-muted-foreground">
                Receive regular rental income distributions directly to your wallet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Investing?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of investors already building wealth through tokenized real estate on TokenEstate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/marketplace')}>
              Browse Properties
            </Button>
            {!isLoggedIn && (
              <Button size="lg" variant="outline" onClick={openLoginModal}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
