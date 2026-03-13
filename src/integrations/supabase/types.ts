export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string
          participant_a: string
          participant_b: string
          reservation_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string
          participant_a: string
          participant_b: string
          reservation_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string
          participant_a?: string
          participant_b?: string
          reservation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: true
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean
          sender_id: string
        }
        Insert: {
          content?: string
          conversation_id: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          paid_at: string | null
          payer_id: string
          payment_method: string | null
          platform_fee: number
          recipient_id: string
          reservation_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          payer_id: string
          payment_method?: string | null
          platform_fee?: number
          recipient_id: string
          reservation_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          payer_id?: string
          payment_method?: string | null
          platform_fee?: number
          recipient_id?: string
          reservation_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reservation_photos: {
        Row: {
          created_at: string
          id: string
          photo_path: string
          reservation_ref: string
          risk_notes: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          photo_path: string
          reservation_ref: string
          risk_notes?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          photo_path?: string
          reservation_ref?: string
          risk_notes?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          end_date: string
          host_id: string
          id: string
          notes: string | null
          renter_id: string
          space_id: string | null
          start_date: string
          status: string
          total_price: number
          updated_at: string
          volume: number
        }
        Insert: {
          created_at?: string
          end_date: string
          host_id: string
          id?: string
          notes?: string | null
          renter_id: string
          space_id?: string | null
          start_date: string
          status?: string
          total_price?: number
          updated_at?: string
          volume?: number
        }
        Update: {
          created_at?: string
          end_date?: string
          host_id?: string
          id?: string
          notes?: string | null
          renter_id?: string
          space_id?: string | null
          start_date?: string
          status?: string
          total_price?: number
          updated_at?: string
          volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservations_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      review_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          protocol_number: string
          reason: string
          risk_analysis_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          protocol_number: string
          reason: string
          risk_analysis_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          protocol_number?: string
          reason?: string
          risk_analysis_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_requests_risk_analysis_id_fkey"
            columns: ["risk_analysis_id"]
            isOneToOne: false
            referencedRelation: "risk_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          host_id: string
          id: string
          rating: number
          reservation_id: string
          reviewer_id: string
          space_id: string | null
        }
        Insert: {
          comment?: string
          created_at?: string
          host_id: string
          id?: string
          rating: number
          reservation_id: string
          reviewer_id: string
          space_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string
          host_id?: string
          id?: string
          rating?: number
          reservation_id?: string
          reviewer_id?: string
          space_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_analyses: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          reservation_ref: string
          reviewed_at: string | null
          reviewed_by: string | null
          risk_level: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          reservation_ref: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          reservation_ref?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      spaces: {
        Row: {
          access_hours: string | null
          access_type: string | null
          availability: string | null
          availability_schedule: Json | null
          available_days: string[] | null
          beneficiary_name: string | null
          cleaning_fee_amount: number | null
          cleaning_fee_enabled: boolean | null
          closed: boolean | null
          covered: boolean | null
          created_at: string
          description: string | null
          document_number: string | null
          easy_access: boolean | null
          height: number | null
          id: string
          length: number | null
          location: string
          notes: string | null
          onboarding_step: number | null
          photos: string[] | null
          pix_key: string | null
          pix_key_type: string | null
          price_per_day: number | null
          rental_type: string
          rules: string | null
          security_features: string | null
          space_category: string | null
          space_type: string
          status: string
          updated_at: string
          user_id: string
          volume: number | null
          width: number | null
        }
        Insert: {
          access_hours?: string | null
          access_type?: string | null
          availability?: string | null
          availability_schedule?: Json | null
          available_days?: string[] | null
          beneficiary_name?: string | null
          cleaning_fee_amount?: number | null
          cleaning_fee_enabled?: boolean | null
          closed?: boolean | null
          covered?: boolean | null
          created_at?: string
          description?: string | null
          document_number?: string | null
          easy_access?: boolean | null
          height?: number | null
          id?: string
          length?: number | null
          location?: string
          notes?: string | null
          onboarding_step?: number | null
          photos?: string[] | null
          pix_key?: string | null
          pix_key_type?: string | null
          price_per_day?: number | null
          rental_type?: string
          rules?: string | null
          security_features?: string | null
          space_category?: string | null
          space_type?: string
          status?: string
          updated_at?: string
          user_id: string
          volume?: number | null
          width?: number | null
        }
        Update: {
          access_hours?: string | null
          access_type?: string | null
          availability?: string | null
          availability_schedule?: Json | null
          available_days?: string[] | null
          beneficiary_name?: string | null
          cleaning_fee_amount?: number | null
          cleaning_fee_enabled?: boolean | null
          closed?: boolean | null
          covered?: boolean | null
          created_at?: string
          description?: string | null
          document_number?: string | null
          easy_access?: boolean | null
          height?: number | null
          id?: string
          length?: number | null
          location?: string
          notes?: string | null
          onboarding_step?: number | null
          photos?: string[] | null
          pix_key?: string | null
          pix_key_type?: string | null
          price_per_day?: number | null
          rental_type?: string
          rules?: string | null
          security_features?: string | null
          space_category?: string | null
          space_type?: string
          status?: string
          updated_at?: string
          user_id?: string
          volume?: number | null
          width?: number | null
        }
        Relationships: []
      }
      terms_acceptances: {
        Row: {
          accepted_at: string
          context: string | null
          id: string
          term_type: string
          term_version: string
          user_id: string
        }
        Insert: {
          accepted_at?: string
          context?: string | null
          id?: string
          term_type: string
          term_version?: string
          user_id: string
        }
        Update: {
          accepted_at?: string
          context?: string | null
          id?: string
          term_type?: string
          term_version?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_platform_stats: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
