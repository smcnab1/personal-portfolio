export interface CertProps {
  membership: string;
  organisation: string;
  logo: string | null;
  type: string;
  start_date: string;
  end_date: string | null;
  industry: string;
  link: string | null;
  description?: string[];
}
