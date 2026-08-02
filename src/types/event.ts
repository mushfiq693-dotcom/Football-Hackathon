export interface Event {
  id: string;
  event_name: string;
  academic_session: string;
  department: string;
  tournament_name: string;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}
