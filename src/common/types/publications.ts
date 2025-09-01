export interface PublicationProps {
  title: string;
  journal: string;
  logo: string | null;
  location: string | null;
  location_type: string | null;
  type: string;
  start_date: string;
  link: string | null;
  overview?: string[];
}
