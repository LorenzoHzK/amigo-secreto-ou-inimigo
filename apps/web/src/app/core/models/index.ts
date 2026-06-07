export interface Group {
  id: string;
  name: string;
  admin_token: string;
  invite_token: string;
  price_limit: number | null;
  drawn_at: string | null; // ISO date string
  created_at: string; // ISO date string
}

export interface Participant {
  id: string;
  group_id: string;
  name: string;
  personal_token: string;
  drawn_participant_id: string | null;
  created_at: string; // ISO date string
}
