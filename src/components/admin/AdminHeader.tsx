
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="contacts">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="contacts">Contact Requests</TabsTrigger>
          <TabsTrigger value="properties" disabled>Properties</TabsTrigger>
          <TabsTrigger value="users" disabled>Users</TabsTrigger>
          <TabsTrigger value="transactions" disabled>Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts">
          <Card>
            <CardContent className="pt-6 px-6">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                <StatsCard title="Total Requests" value="--" description="All time" />
                <StatsCard title="New Requests" value="--" description="Last 7 days" />
                <StatsCard title="Newsletter Opts" value="--" description="Subscription rate" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="properties">
          <p className="text-muted-foreground text-center p-6">Properties management coming soon</p>
        </TabsContent>
        <TabsContent value="users">
          <p className="text-muted-foreground text-center p-6">User management coming soon</p>
        </TabsContent>
        <TabsContent value="transactions">
          <p className="text-muted-foreground text-center p-6">Transaction history coming soon</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StatsCard = ({ title, value, description }: { title: string; value: string; description: string }) => (
  <div className="border rounded-lg p-4 flex flex-col">
    <span className="text-muted-foreground text-sm">{title}</span>
    <span className="text-2xl font-bold mt-1">{value}</span>
    <span className="text-xs text-muted-foreground mt-1">{description}</span>
  </div>
);

export default AdminHeader;
