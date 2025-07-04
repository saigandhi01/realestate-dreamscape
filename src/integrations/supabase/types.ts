export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      property_listing_surveys: {
        Row: {
          additional_notes: string | null
          amenities: string[] | null
          bathrooms: number
          bedrooms: number
          built_up_area: string
          created_at: string
          email: string
          full_name: string
          id: string
          land_area: string
          phone_number: string
          property_location: string
          property_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          additional_notes?: string | null
          amenities?: string[] | null
          bathrooms: number
          bedrooms: number
          built_up_area: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          land_area: string
          phone_number: string
          property_location: string
          property_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          additional_notes?: string | null
          amenities?: string[] | null
          bathrooms?: number
          bedrooms?: number
          built_up_area?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          land_area?: string
          phone_number?: string
          property_location?: string
          property_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      seller_contact_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          mobile: string
          name: string
          newsletter_subscription: boolean
          property_id: string
          property_name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          mobile: string
          name: string
          newsletter_subscription?: boolean
          property_id: string
          property_name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          mobile?: string
          name?: string
          newsletter_subscription?: boolean
          property_id?: string
          property_name?: string
        }
        Relationships: []
      }
      user_investment_performance: {
        Row: {
          annual_yield: number
          current_value: number
          id: string
          monthly_income: number
          roi_percentage: number
          total_invested: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          annual_yield?: number
          current_value?: number
          id?: string
          monthly_income?: number
          roi_percentage?: number
          total_invested?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          annual_yield?: number
          current_value?: number
          id?: string
          monthly_income?: number
          roi_percentage?: number
          total_invested?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_portfolios: {
        Row: {
          created_at: string | null
          id: string
          ownership_percentage: number
          progress: number
          property_id: string
          property_name: string
          property_type: string
          tokens_owned: number
          updated_at: string | null
          user_id: string
          value_per_token: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          ownership_percentage: number
          progress: number
          property_id: string
          property_name: string
          property_type: string
          tokens_owned: number
          updated_at?: string | null
          user_id: string
          value_per_token: number
        }
        Update: {
          created_at?: string | null
          id?: string
          ownership_percentage?: number
          progress?: number
          property_id?: string
          property_name?: string
          property_type?: string
          tokens_owned?: number
          updated_at?: string | null
          user_id?: string
          value_per_token?: number
        }
        Relationships: []
      }
      user_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          property_id: string
          property_name: string
          recipient_address: string | null
          tokens: number
          transaction_hash: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          property_id: string
          property_name: string
          recipient_address?: string | null
          tokens: number
          transaction_hash: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          property_id?: string
          property_name?: string
          recipient_address?: string | null
          tokens?: number
          transaction_hash?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
