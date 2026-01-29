export interface ProjectImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  projectId: string;
  type?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  content: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectWithImages extends Project {
  images: ProjectImage[];
}
