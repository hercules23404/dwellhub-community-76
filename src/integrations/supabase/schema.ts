
export interface Database {
  public: {
    Tables: {
      notices: {
        Row: {
          id: string;
          notice_id: string;
          title: string;
          content: string;
          category: string;
          target: string;
          author_id: string | null;
          author_name: string;
          author_avatar: string | null;
          publish_date: string;
          expiry_date: string | null;
          status: string;
          comments_count: number;
          likes_count: number;
          created_at: string | null;
          updated_at: string | null;
        };
      };
      notice_comments: {
        Row: {
          id: string;
          notice_id: string | null;
          user_id: string | null;
          content: string;
          created_at: string | null;
        };
      };
      notice_likes: {
        Row: {
          id: string;
          notice_id: string | null;
          user_id: string | null;
          created_at: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          payment_id: string;
          amount: number;
          status: string;
          type: string;
          user_id: string | null;
          property_id: string | null;
          due_date: string | null;
          payment_date: string | null;
          created_at: string | null;
        };
      };
      properties: {
        Row: {
          id: string;
          property_id: string;
          name: string;
          address: string;
          type: string;
          units: number;
          rent: string;
          status: string;
          featured: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
      };
      services: {
        Row: {
          id: string;
          service_id: string;
          title: string;
          description: string | null;
          category: string;
          status: string;
          user_id: string | null;
          property_id: string | null;
          unit_number: string | null;
          priority: string;
          scheduled_date: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          phone_number: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
      };
      User: {
        Row: {
          id: number;
          Name: string | null;
          email: string | null;
          created_at: string;
          bio: string | null;
          Status: string | null;
          First_name: string | null;
          last_name: string | null;
          "phone number": number | null;
        };
      };
    };
  };
}
