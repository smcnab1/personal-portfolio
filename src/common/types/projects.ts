export interface ProjectItemProps {
  title: string;
  slug: string;
  description: string;
  image: string | null;
  link_demo?: string | null;
  link_github?: string | null;
  stacks: string | null;
  content?: string;
  is_show: boolean;
  is_featured: boolean;
  updated_at: Date;
}

export interface ProjectsProps {
  projects: ProjectItemProps[];
}
