
import { useEffect } from 'react';
import { ArrowRight, Building, Coins, LineChart, Lock, Settings, Users, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FadeIn, PageTransition, RevealOnScroll, SlideUp, StaggerChildren } from '@/components/ui/animations';

const HowItWorks = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Process steps data
  const steps = [
    {
      icon: <Building className="h-8 w-8 text-white" />,
      title: "Property Selection",
      description: "We carefully select high-quality real estate properties with strong investment potential."
    },
    {
      icon: <Settings className="h-8 w-8 text-white" />,
      title: "Legal Structuring",
      description: "Each property is structured into a legal entity that complies with securities regulations."
    },
    {
      icon: <Coins className="h-8 w-8 text-white" />,
      title: "Tokenization",
      description: "The property is tokenized using blockchain technology, creating digital tokens that represent ownership."
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Offering",
      description: "Tokens are made available on our platform, allowing investors to purchase fractional ownership."
    },
    {
      icon: <LineChart className="h-8 w-8 text-white" />,
      title: "Management",
      description: "Professional property management handles day-to-day operations, optimizing returns."
    },
    {
      icon: <Wallet className="h-8 w-8 text-white" />,
      title: "Returns Distribution",
      description: "Rental income and appreciation are distributed to token holders through smart contracts."
    }
  ];

  return (
    <PageTransition className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative bg-secondary/30 py-20">
          <div className="container mx-auto px-6 md:px-10">
            <FadeIn>
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-6 max-w-3xl">
                How Real Estate Tokenization Works
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                Understand the revolutionary process that's making real estate investment 
                more accessible, liquid, and transparent through blockchain technology.
              </p>
            </FadeIn>
          </div>
        </section>
        
        {/* Process Overview */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-10">
            <RevealOnScroll>
              <h2 className="text-3xl font-display font-bold mb-12 text-center">
                The Tokenization Process
              </h2>
            </RevealOnScroll>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <RevealOnScroll key={index} className="h-full">
                  <Card className="border-0 shadow-md h-full overflow-hidden card-hover">
                    <CardContent className="p-0">
                      <div className="bg-primary p-6 flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                          {step.icon}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
        
        {/* Comparison Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6 md:px-10">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-display font-bold mb-4">
                  Traditional vs. Tokenized Real Estate
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  See how tokenized real estate investments compare to traditional methods.
                </p>
              </div>
            </RevealOnScroll>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Traditional Real Estate */}
              <RevealOnScroll>
                <Card className="border-0 shadow-md overflow-hidden">
                  <div className="p-6 bg-card border-b">
                    <h3 className="text-xl font-semibold">Traditional Real Estate</h3>
                  </div>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="text-destructive mr-3">✕</span>
                        <div>
                          <p className="font-medium">High Minimum Investment</p>
                          <p className="text-sm text-muted-foreground">
                            Typically requires hundreds of thousands of dollars to invest
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-destructive mr-3">✕</span>
                        <div>
                          <p className="font-medium">Limited Liquidity</p>
                          <p className="text-sm text-muted-foreground">
                            Can take months to sell your investment
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-destructive mr-3">✕</span>
                        <div>
                          <p className="font-medium">Complex Administration</p>
                          <p className="text-sm text-muted-foreground">
                            Requires extensive paperwork and intermediaries
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-destructive mr-3">✕</span>
                        <div>
                          <p className="font-medium">Geographical Limitations</p>
                          <p className="text-sm text-muted-foreground">
                            Often restricted to local markets you understand
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-destructive mr-3">✕</span>
                        <div>
                          <p className="font-medium">High Transaction Costs</p>
                          <p className="text-sm text-muted-foreground">
                            Expensive broker fees, taxes, and legal costs
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </RevealOnScroll>
              
              {/* Tokenized Real Estate */}
              <RevealOnScroll>
                <Card className="border-0 shadow-md overflow-hidden">
                  <div className="p-6 bg-primary">
                    <h3 className="text-xl font-semibold text-white">Tokenized Real Estate</h3>
                  </div>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="text-primary mr-3">✓</span>
                        <div>
                          <p className="font-medium">Low Minimum Investment</p>
                          <p className="text-sm text-muted-foreground">
                            Start investing with as little as $100
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-3">✓</span>
                        <div>
                          <p className="font-medium">Enhanced Liquidity</p>
                          <p className="text-sm text-muted-foreground">
                            Trade tokens on secondary markets at any time
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-3">✓</span>
                        <div>
                          <p className="font-medium">Automated Administration</p>
                          <p className="text-sm text-muted-foreground">
                            Smart contracts handle transactions and dividend distribution
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-3">✓</span>
                        <div>
                          <p className="font-medium">Global Access</p>
                          <p className="text-sm text-muted-foreground">
                            Invest in properties worldwide from your device
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-3">✓</span>
                        <div>
                          <p className="font-medium">Reduced Transaction Costs</p>
                          <p className="text-sm text-muted-foreground">
                            Lower fees due to blockchain efficiency and fewer intermediaries
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-10">
            <RevealOnScroll>
              <h2 className="text-3xl font-display font-bold mb-12 text-center">
                Frequently Asked Questions
              </h2>
            </RevealOnScroll>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <StaggerChildren>
                {[
                  {
                    question: "What is real estate tokenization?",
                    answer: "Real estate tokenization is the process of converting real property ownership rights into digital tokens on a blockchain. These tokens represent fractional ownership in a property, allowing multiple investors to own portions of a single asset."
                  },
                  {
                    question: "How are property tokens valued?",
                    answer: "Property tokens are initially valued based on the appraised value of the real estate. After the initial offering, token prices may fluctuate based on market demand, property performance, and the overall real estate market conditions."
                  },
                  {
                    question: "What rights do token holders have?",
                    answer: "Token holders typically have rights to a proportional share of rental income, appreciation, and voting rights on certain property decisions, depending on the specific token structure and legal framework."
                  },
                  {
                    question: "How are returns distributed?",
                    answer: "Returns are typically distributed as digital currency or stablecoins through smart contracts on a quarterly basis. These distributions represent your share of the rental income generated by the property."
                  },
                  {
                    question: "What happens if I want to sell my tokens?",
                    answer: "You can sell your tokens on the platform's secondary market or on supported exchanges, providing liquidity that is not typically available with traditional real estate investments."
                  },
                  {
                    question: "Are real estate tokens regulated?",
                    answer: "Yes, real estate tokens are typically structured to comply with securities regulations in the jurisdictions where they are offered. TokenEstate ensures all offerings meet applicable regulatory requirements."
                  }
                ].map((faq, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </StaggerChildren>
            </div>
            
            <RevealOnScroll className="mt-12 text-center">
              <p className="text-muted-foreground mb-6">
                Want to learn more about the technology behind real estate tokenization?
              </p>
              <Button asChild>
                <Link to="/erc-standards" className="flex items-center">
                  Explore ERC Standards
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </RevealOnScroll>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-6 md:px-10">
            <RevealOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Ready to Start Your Investment Journey?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Browse our curated selection of tokenized properties and begin building 
                  your real estate portfolio with as little as $100.
                </p>
                <Button asChild size="lg" className="button-hover">
                  <Link to="/marketplace">View Properties</Link>
                </Button>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default HowItWorks;
