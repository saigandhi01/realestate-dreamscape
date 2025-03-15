
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";

interface FinancialsData {
  overview: {
    propertyValue: number;
    tokensIssued: number;
    rentalYield: number;
    annualAppreciation: number;
    lastDistribution: string;
    nextDistribution: string;
    currency?: string;
  };
  returns: {
    projectedAnnualReturn: number;
    rentalIncome: number;
    propertyAppreciation: number;
    projectedROI5Years: number;
    projectedROI10Years: number;
  };
}

interface PropertyFinancialsTabProps {
  financials: FinancialsData;
}

const PropertyFinancialsTab = ({ financials }: PropertyFinancialsTabProps) => {
  // Check if currency is specified, default to INR
  const currencySymbol = financials.overview.currency === 'USD' ? '$' : '₹';
  
  return (
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
              <span className="font-semibold">{currencySymbol}{financials.overview.propertyValue.toLocaleString()}</span>
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
  );
};

export default PropertyFinancialsTab;
