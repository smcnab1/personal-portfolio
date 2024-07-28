export interface PublicationProps {
    title: string;
    journal: string;
    logo: string | null;
    location: string;
    location_type: string;
    type: string;
    start_date: string;
    link: string | null;
    overview?: string[];
  }
  