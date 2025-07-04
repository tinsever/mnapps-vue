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
      country: {
        Row: {
          author: string | null
          created_at: string
          forum: string | null
          full_name: string | null
          id: number
          name: string | null
          short: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string
          forum?: string | null
          full_name?: string | null
          id?: number
          name?: string | null
          short?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string
          forum?: string | null
          full_name?: string | null
          id?: number
          name?: string | null
          short?: string | null
        }
        Relationships: []
      }
      newspaper: {
        Row: {
          author: string | null
          country: number | null
          created_at: string
          description: string | null
          id: number
          name: string | null
          rss: string | null
          url: string | null
        }
        Insert: {
          author?: string | null
          country?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          rss?: string | null
          url?: string | null
        }
        Update: {
          author?: string | null
          country?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          rss?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newspaper_country_fkey"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "country"
            referencedColumns: ["id"]
          },
        ]
      }
      newspaper_list: {
        Row: {
          author: string | null
          created_at: string
          filter_authors: string[] | null
          filter_categories: string[] | null
          id: string
          name: string | null
          newspapers: number[] | null
        }
        Insert: {
          author?: string | null
          created_at?: string
          filter_authors?: string[] | null
          filter_categories?: string[] | null
          id?: string
          name?: string | null
          newspapers?: number[] | null
        }
        Update: {
          author?: string | null
          created_at?: string
          filter_authors?: string[] | null
          filter_categories?: string[] | null
          id?: string
          name?: string | null
          newspapers?: number[] | null
        }
        Relationships: []
      }
      parsed_news: {
        Row: {
          author: string | null
          categories: string[] | null
          content_html: string | null
          created_at: string
          id: number
          image_url: string | null
          link: string
          newspaper_id: number
          published_at: string | null
          raw_item: Json | null
          snippet: string | null
          title: string | null
        }
        Insert: {
          author?: string | null
          categories?: string[] | null
          content_html?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          link: string
          newspaper_id: number
          published_at?: string | null
          raw_item?: Json | null
          snippet?: string | null
          title?: string | null
        }
        Update: {
          author?: string | null
          categories?: string[] | null
          content_html?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          link?: string
          newspaper_id?: number
          published_at?: string | null
          raw_item?: Json | null
          snippet?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parsed_news_newspaper_id_fkey"
            columns: ["newspaper_id"]
            isOneToOne: false
            referencedRelation: "newspaper"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_distinct_authors: {
        Args: Record<PropertyKey, never>
        Returns: {
          author_name: string
        }[]
      }
      get_distinct_categories: {
        Args: Record<PropertyKey, never>
        Returns: {
          category_name: string
        }[]
      }
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
