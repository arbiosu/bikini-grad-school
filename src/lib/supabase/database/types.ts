export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      addon_products: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          body: string;
          featured_image: string | null;
          id: number;
        };
        Insert: {
          body: string;
          featured_image?: string | null;
          id: number;
        };
        Update: {
          body?: string;
          featured_image?: string | null;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'articles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'contents';
            referencedColumns: ['id'];
          },
        ];
      };
      content_contributors: {
        Row: {
          content_id: number;
          contributor_id: number;
          id: number;
          role_id: number;
        };
        Insert: {
          content_id: number;
          contributor_id: number;
          id?: number;
          role_id: number;
        };
        Update: {
          content_id?: number;
          contributor_id?: number;
          id?: number;
          role_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'content_contributors_content_id_fkey';
            columns: ['content_id'];
            isOneToOne: false;
            referencedRelation: 'contents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'content_contributors_contributor_id_fkey';
            columns: ['contributor_id'];
            isOneToOne: false;
            referencedRelation: 'contributors';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'content_contributors_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'creative_roles';
            referencedColumns: ['id'];
          },
        ];
      };
      content_metrics: {
        Row: {
          content_id: number;
          id: number;
          likes: number | null;
          shares: number | null;
          updated_at: string | null;
          views: number | null;
        };
        Insert: {
          content_id: number;
          id?: number;
          likes?: number | null;
          shares?: number | null;
          updated_at?: string | null;
          views?: number | null;
        };
        Update: {
          content_id?: number;
          id?: number;
          likes?: number | null;
          shares?: number | null;
          updated_at?: string | null;
          views?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'content_metrics_content_id_fkey';
            columns: ['content_id'];
            isOneToOne: false;
            referencedRelation: 'contents';
            referencedColumns: ['id'];
          },
        ];
      };
      content_tags: {
        Row: {
          content_id: number;
          tag_id: number;
        };
        Insert: {
          content_id: number;
          tag_id: number;
        };
        Update: {
          content_id?: number;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'content_tags_content_id_fkey';
            columns: ['content_id'];
            isOneToOne: false;
            referencedRelation: 'contents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'content_tags_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['id'];
          },
        ];
      };
      contents: {
        Row: {
          cover_image_url: string | null;
          created_at: string | null;
          id: number;
          issue_id: number;
          published: boolean | null;
          published_at: string | null;
          slug: string;
          summary: string | null;
          title: string;
          type: Database['public']['Enums']['content_type'];
          updated_at: string | null;
        };
        Insert: {
          cover_image_url?: string | null;
          created_at?: string | null;
          id?: number;
          issue_id: number;
          published?: boolean | null;
          published_at?: string | null;
          slug: string;
          summary?: string | null;
          title: string;
          type: Database['public']['Enums']['content_type'];
          updated_at?: string | null;
        };
        Update: {
          cover_image_url?: string | null;
          created_at?: string | null;
          id?: number;
          issue_id?: number;
          published?: boolean | null;
          published_at?: string | null;
          slug?: string;
          summary?: string | null;
          title?: string;
          type?: Database['public']['Enums']['content_type'];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'contents_issue_id_fkey';
            columns: ['issue_id'];
            isOneToOne: false;
            referencedRelation: 'issues';
            referencedColumns: ['id'];
          },
        ];
      };
      contributors: {
        Row: {
          avatar: string | null;
          bio: string | null;
          created_at: string | null;
          id: number;
          name: string;
          role_id: number | null;
          social_links: Json | null;
          updated_at: string | null;
        };
        Insert: {
          avatar?: string | null;
          bio?: string | null;
          created_at?: string | null;
          id?: number;
          name: string;
          role_id?: number | null;
          social_links?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          avatar?: string | null;
          bio?: string | null;
          created_at?: string | null;
          id?: number;
          name?: string;
          role_id?: number | null;
          social_links?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'contributors_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'creative_roles';
            referencedColumns: ['id'];
          },
        ];
      };
      creative_roles: {
        Row: {
          description: string | null;
          id: number;
          name: string;
        };
        Insert: {
          description?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          description?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      features: {
        Row: {
          description: string | null;
          id: number;
          image_urls: Json | null;
        };
        Insert: {
          description?: string | null;
          id: number;
          image_urls?: Json | null;
        };
        Update: {
          description?: string | null;
          id?: number;
          image_urls?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'features_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'contents';
            referencedColumns: ['id'];
          },
        ];
      };
      interviews: {
        Row: {
          id: number;
          interviewee_bio: string | null;
          interviewee_name: string;
          profile_image: string | null;
          transcript: string | null;
        };
        Insert: {
          id: number;
          interviewee_bio?: string | null;
          interviewee_name: string;
          profile_image?: string | null;
          transcript?: string | null;
        };
        Update: {
          id?: number;
          interviewee_bio?: string | null;
          interviewee_name?: string;
          profile_image?: string | null;
          transcript?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'interviews_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'contents';
            referencedColumns: ['id'];
          },
        ];
      };
      issues: {
        Row: {
          cover_image: string | null;
          created_at: string | null;
          id: number;
          issue_number: string | null;
          publication_date: string;
          published: boolean;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          cover_image?: string | null;
          created_at?: string | null;
          id?: number;
          issue_number?: string | null;
          publication_date: string;
          published?: boolean;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          cover_image?: string | null;
          created_at?: string | null;
          id?: number;
          issue_number?: string | null;
          publication_date?: string;
          published?: boolean;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          account_claimed_at: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          stripe_customer_id: string | null;
          updated_at: string;
        };
        Insert: {
          account_claimed_at?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          stripe_customer_id?: string | null;
          updated_at?: string;
        };
        Update: {
          account_claimed_at?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          stripe_customer_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscription_addon_selections: {
        Row: {
          addon_product_id: string;
          created_at: string;
          id: string;
          subscription_id: string;
        };
        Insert: {
          addon_product_id: string;
          created_at?: string;
          id?: string;
          subscription_id: string;
        };
        Update: {
          addon_product_id?: string;
          created_at?: string;
          id?: string;
          subscription_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscription_addon_selections_addon_product_id_fkey';
            columns: ['addon_product_id'];
            isOneToOne: false;
            referencedRelation: 'addon_products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'subscription_addon_selections_subscription_id_fkey';
            columns: ['subscription_id'];
            isOneToOne: false;
            referencedRelation: 'subscriptions';
            referencedColumns: ['id'];
          },
        ];
      };
      subscription_tiers: {
        Row: {
          addon_slots: number;
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          stripe_product_id: string | null;
          updated_at: string;
        };
        Insert: {
          addon_slots?: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          stripe_product_id?: string | null;
          updated_at?: string;
        };
        Update: {
          addon_slots?: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          stripe_product_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean;
          created_at: string;
          current_period_end: string | null;
          current_period_start: string | null;
          id: string;
          status: string;
          stripe_subscription_id: string;
          tier_id: string;
          tier_price_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          cancel_at_period_end?: boolean;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          status?: string;
          stripe_subscription_id: string;
          tier_id: string;
          tier_price_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          cancel_at_period_end?: boolean;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          status?: string;
          stripe_subscription_id?: string;
          tier_id?: string;
          tier_price_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_tier_id_fkey';
            columns: ['tier_id'];
            isOneToOne: false;
            referencedRelation: 'subscription_tiers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'subscriptions_tier_price_id_fkey';
            columns: ['tier_price_id'];
            isOneToOne: false;
            referencedRelation: 'tier_prices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'subscriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      tags: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      tier_prices: {
        Row: {
          amount: number;
          created_at: string;
          currency: string;
          id: string;
          interval: string;
          is_active: boolean;
          stripe_price_id: string | null;
          tier_id: string;
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          currency?: string;
          id?: string;
          interval: string;
          is_active?: boolean;
          stripe_price_id?: string | null;
          tier_id: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          currency?: string;
          id?: string;
          interval?: string;
          is_active?: boolean;
          stripe_price_id?: string | null;
          tier_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tier_prices_tier_id_fkey';
            columns: ['tier_id'];
            isOneToOne: false;
            referencedRelation: 'subscription_tiers';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_full_content:
        | {
            Args: { content_data: Json; contributors: Json; type_data: Json };
            Returns: number;
          }
        | {
            Args: {
              content_data: Json;
              content_tags: Json;
              contributors: Json;
              type_data: Json;
            };
            Returns: number;
          };
      update_full_content: {
        Args: {
          content_data: Json;
          content_tags: Json;
          contributors: Json;
          p_content_id: number;
          type_data: Json;
        };
        Returns: undefined;
      };
    };
    Enums: {
      content_type: 'article' | 'feature' | 'interview' | 'digi_media';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      content_type: ['article', 'feature', 'interview', 'digi_media'],
    },
  },
} as const;

export type Count = 'exact' | 'planned' | 'estimated';
export type SortOrder = 'asc' | 'desc';
