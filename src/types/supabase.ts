
// Define types for database tables
export interface Database {
  public: {
    Tables: {
      user_portfolios: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          property_name: string;
          tokens_owned: number;
          value_per_token: number;
          ownership_percentage: number;
          property_type: string;
          progress: number;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          property_name: string;
          tokens_owned: number;
          value_per_token: number;
          ownership_percentage: number;
          property_type: string;
          progress: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string;
          property_name?: string;
          tokens_owned?: number;
          value_per_token?: number;
          ownership_percentage?: number;
          property_type?: string;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_transactions: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          property_name: string;
          transaction_type: string;
          tokens: number;
          amount: number;
          recipient_address?: string;
          transaction_hash: string;
          created_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          property_name: string;
          transaction_type: string;
          tokens: number;
          amount: number;
          recipient_address?: string;
          transaction_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string;
          property_name?: string;
          transaction_type?: string;
          tokens?: number;
          amount?: number;
          recipient_address?: string;
          transaction_hash?: string;
          created_at?: string;
        };
      };
      user_investment_performance: {
        Row: {
          id: string;
          user_id: string;
          total_invested: number;
          current_value: number;
          roi_percentage: number;
          annual_yield: number;
          monthly_income: number;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_invested: number;
          current_value: number;
          roi_percentage: number;
          annual_yield: number;
          monthly_income: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_invested?: number;
          current_value?: number;
          roi_percentage?: number;
          annual_yield?: number;
          monthly_income?: number;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper function to type-cast Supabase queries
export const from = <T extends keyof Database['public']['Tables']>(
  table: T
) => {
  return table as unknown as T;
};
