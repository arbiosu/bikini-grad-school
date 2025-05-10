export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author: string
          content: string
          contributor: string | null
          created_at: string
          id: string
          img_path: string
          is_published: boolean
          issue_id: number
          subtitle: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string
          content?: string
          contributor?: string | null
          created_at?: string
          id?: string
          img_path?: string
          is_published?: boolean
          issue_id: number
          subtitle?: string
          title?: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          content?: string
          contributor?: string | null
          created_at?: string
          id?: string
          img_path?: string
          is_published?: boolean
          issue_id?: number
          subtitle?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_contributor_fkey"
            columns: ["contributor"]
            isOneToOne: false
            referencedRelation: "contributors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      contributors: {
        Row: {
          avatar_path: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_path?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_path?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      creative_roles: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      issues: {
        Row: {
          cover_image_id: string | null
          cover_image_path: string
          created_at: string
          description: string
          id: number
          is_published: boolean
          issue_number: number | null
          publication_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_image_id?: string | null
          cover_image_path?: string
          created_at?: string
          description?: string
          id?: number
          is_published?: boolean
          issue_number?: number | null
          publication_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Update: {
          cover_image_id?: string | null
          cover_image_path?: string
          created_at?: string
          description?: string
          id?: number
          is_published?: boolean
          issue_number?: number | null
          publication_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      photoshoot_contributors: {
        Row: {
          contributor_id: string
          photoshoot_id: string
          role_id: number
        }
        Insert: {
          contributor_id: string
          photoshoot_id: string
          role_id: number
        }
        Update: {
          contributor_id?: string
          photoshoot_id?: string
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "photoshoot_contributors_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "contributors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photoshoot_contributors_photoshoot_id_fkey"
            columns: ["photoshoot_id"]
            isOneToOne: false
            referencedRelation: "photoshoots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photoshoot_contributors_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "creative_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      photoshoots: {
        Row: {
          cover_image_id: string | null
          created_at: string
          description: string | null
          id: string
          images: string[]
          issue_id: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_image_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          issue_id?: number | null
          title?: string
          updated_at?: string | null
        }
        Update: {
          cover_image_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          issue_id?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photoshoots_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
