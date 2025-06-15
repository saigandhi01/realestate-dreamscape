
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Percent, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface InvestmentData {
  totalInvested: string;
  currentValue: string;
  roi: string;
  annualYield: string;
  monthlyIncome: string;
}

interface ROISectionProps {
  investmentData: InvestmentData;
  isLoading: boolean;
}

const ROISection: React.FC<ROISectionProps> = ({ 
  investmentData, 
  isLoading 
}) => {
  const isPositiveROI = investmentData.roi.includes('+');

  if (isLoading) {
    return (
      <Card className="w-full shadow-md bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Investment Performance</CardTitle>
          <CardDescription>Your returns and portfolio metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      title: 'Total Invested',
      value: investmentData.totalInvested,
      icon: DollarSign,
      description: 'Capital deployed',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Current Value',
      value: investmentData.currentValue,
      icon: TrendingUp,
      description: 'Portfolio worth',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'ROI',
      value: investmentData.roi,
      icon: Percent,
      description: 'Return on investment',
      color: isPositiveROI ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    },
    {
      title: 'Annual Yield',
      value: investmentData.annualYield,
      icon: Calendar,
      description: 'Yearly returns',
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <Card className="w-full shadow-md bg-card/50 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Investment Performance</CardTitle>
            <CardDescription>Your returns and portfolio metrics</CardDescription>
          </div>
          <Badge 
            variant={isPositiveROI ? "default" : "destructive"}
            className="text-sm"
          >
            {isPositiveROI ? "Profitable" : "Loss"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {metric.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Monthly Income Section */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="font-medium">Monthly Income</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {investmentData.monthlyIncome}
              </div>
              <div className="text-xs text-muted-foreground">
                Recurring returns
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROISection;
