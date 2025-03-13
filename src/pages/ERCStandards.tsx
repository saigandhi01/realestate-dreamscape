
import { PageTransition } from '@/components/ui/animations';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ERCStandards = () => {
  return (
    <PageTransition className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-6">ERC Standards</h1>
          
          <div className="prose max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Understanding ERC Standards</h2>
              <p className="text-lg mb-4">
                ERC (Ethereum Request for Comments) standards are technical specifications that define how Ethereum-based tokens and smart contracts should function. These standards ensure compatibility, security, and interoperability within the Ethereum ecosystem.
              </p>
              <p className="text-lg mb-4">
                ERC standards work as predefined rules that developers follow when creating tokens, smart contracts, and applications. They help different projects integrate seamlessly with wallets, exchanges, and decentralized applications (dApps).
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">How ERC Standards Work in Payment Methods</h2>
              <p className="text-lg mb-6">
                In the context of payments, ERC standards define how tokens are transferred, managed, and verified within Ethereum-based payment systems. Some key ERC standards used in payment methods include:
              </p>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>1. ERC-20 (Fungible Tokens)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 mb-4 space-y-2">
                      <li>The most widely used standard for fungible tokens.</li>
                      <li>Defines functions like <code>transfer</code>, <code>approve</code>, and <code>balanceOf</code> for smooth transactions.</li>
                      <li>Used for cryptocurrencies, utility tokens, and stablecoins (e.g., USDT, USDC).</li>
                    </ul>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="font-semibold">Example in Payment:</p>
                      <p>A merchant accepts ERC-20 tokens as payment, and customers can transfer tokens using a simple <code>transfer</code> function.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>2. ERC-721 (Non-Fungible Tokens - NFTs)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 mb-4 space-y-2">
                      <li>Represents unique digital assets.</li>
                      <li>Commonly used in digital collectibles, gaming, and real estate tokenization.</li>
                      <li>Payments can be made by transferring ownership of an NFT in exchange for another token.</li>
                    </ul>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="font-semibold">Example in Payment:</p>
                      <p>A buyer purchases a digital asset (like an NFT) by sending ERC-20 tokens to a seller, who then transfers the NFT.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>3. ERC-1155 (Multi-Token Standard)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 mb-4 space-y-2">
                      <li>Supports both fungible and non-fungible tokens in a single contract.</li>
                      <li>Reduces gas fees and transaction costs.</li>
                      <li>Useful for batch transactions, gaming, and marketplaces.</li>
                    </ul>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="font-semibold">Example in Payment:</p>
                      <p>A game sells in-game items (ERC-721 NFTs) and virtual currency (ERC-20 tokens) using a single ERC-1155 smart contract.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>4. ERC-1363 (Payable Token Standard)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 mb-4 space-y-2">
                      <li>An extension of ERC-20 that allows direct payments and smart contract interactions in one transaction.</li>
                      <li>Eliminates the need for a separate <code>approve</code> transaction.</li>
                      <li>Improves payment efficiency for e-commerce, subscriptions, and automated payments.</li>
                    </ul>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="font-semibold">Example in Payment:</p>
                      <p>A user pays for an online service with an ERC-1363 token, and the smart contract instantly verifies and processes the payment.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>5. ERC-4626 (Tokenized Vault Standard)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Optimized for DeFi payments and yield-bearing tokens.</li>
                    <li>Standardizes vaults that hold ERC-20 tokens, making yield farming and interest-earning payments more efficient.</li>
                  </ul>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="font-semibold">Example in Payment:</p>
                    <p>A DeFi platform issues ERC-4626 tokens representing user deposits, allowing automatic earnings on staked funds.</p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default ERCStandards;
