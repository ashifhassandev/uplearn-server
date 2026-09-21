export type Education = {
  degree: string;
  institution: string;
  year: string;
};

export type Certificate = {
  key: string | null;
};

export type Experience = {
  role: string;
  company: string;
  duration: string;
  description?: string;
};

export type Links = {
  linkedin: string | null;
  portfolio: string | null;
  github: string | null;
};