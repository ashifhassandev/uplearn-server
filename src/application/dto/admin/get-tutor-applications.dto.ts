export type GetTutorApplicationsInputDTO = {
  page: number;
  limit: number;
  search: string;
  status: string;
};

export type TutorApplicationItem = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  headline: string | null;
  bio: string | null;
  skills: string[];
  experiences: {
    role: string;
    company: string;
    duration: string;
    description?: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certificates?: {
	key: string,
  }[],
  links: {
    linkedin: string | null;
    portfolio: string | null;
    github: string | null;
  };
  applicationStatus: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  createdAt: Date;
};

export type GetTutorApplicationsOutputDTO = {
  applications: TutorApplicationItem[];
  total: number;
  page: number;
  totalPages: number;
};