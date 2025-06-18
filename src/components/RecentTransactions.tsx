
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { DemoTransactionService } from '@/utils/contracts/DemoTransactionService';

interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'transfer';
  property: string;
  amount: string;
  tokens: string;
  hash: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  isLoading 
}) => {
  const { wallet } = useAuth();
  
  // For demo wallet, prioritize localStorage data over props
  const displayTransactions = wallet.walletType === 'demo' 
    ? (() => {
        const demoTxs = DemoTransactionService.getDemoTransactions();
        console.log('RecentTransactions - Demo transactions:', demoTxs);
        
        return demoTxs.map(tx => ({
          id: tx.id,
          date: new Date(tx.timestamp).toLocaleDateString(),
          type: 'buy' as const,
          property: tx.propertyName,
          amount: `${tx.totalCost} ETH`,
          tokens: tx.tokenAmount.toString(),
          hash: tx.transactionHash
        }));
      })()
    : transactions;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'sell':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4 text-blue-500" />;
      default:
        return <ArrowRightLeft className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'sell':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'transfer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const getExplorerUrl = (hash: string) => {
    if (wallet.walletType === 'demo') {
      return '#'; // Demo transactions don't have real explorer links
    }
    return `https://etherscan.io/tx/${hash}`;
  };

  if (isLoading && wallet.walletType !== 'demo') {
    return (
      <Card className="w-full shadow-md bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest investment activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md bg-card/50 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Recent Transactions
          {wallet.walletType === 'demo' && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">DEMO</span>
          )}
        </CardTitle>
        <CardDescription>
          {wallet.walletType === 'demo' 
            ? 'Your demo investment activities'
            : 'Your latest investment activities'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {displayTransactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No recent transactions found</p>
            <p className="text-sm text-muted-foreground mt-2">
              {wallet.walletType === 'demo' 
                ? 'Start making demo purchases to see transaction history here'
                : 'Start investing to see your transaction history here'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayTransactions.slice(0, 5).map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getTransactionColor(transaction.type)}`}>
                        {wallet.walletType === 'demo' ? 'DEMO-' : ''}{transaction.type.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{transaction.property}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.date} • {transaction.tokens} tokens
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <div className="font-medium">{transaction.amount}</div>
                    <div className="text-xs text-muted-foreground">
                      {truncateHash(transaction.hash)}
                    </div>
                  </div>
                  {wallet.walletType !== 'demo' && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <a 
                        href={getExplorerUrl(transaction.hash)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
