export interface ProjectItemProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image: string | null;
  linkDemo?: string | null;
  linkGithub?: string | null;
  stacks: string | null;
  isShow: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
}

export interface ProjectsProps {
  projects: ProjectItemProps[];
}
