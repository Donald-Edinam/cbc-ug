export interface Stat {
  number: string;
  label: string;
}

export interface Event {
  date: string;
  title: string;
  desc: string;
  tag: string;
}

export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
  github?: string;
}

export type TagVariant = "ai" | "web" | "hack" | "data" | "mobile";

export interface ProjectTag {
  label: string;
  variant: TagVariant;
}

export interface Project {
  number: string;
  title: string;
  desc: string;
  tags: ProjectTag[];
}

export interface NavLink {
  href: string;
  label: string;
}
