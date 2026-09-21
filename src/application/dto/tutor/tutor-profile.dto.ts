import type { ApplicationStatus } from "@/domain/enums/application-status.enum";
import type {
  Certificate,
  Education,
  Experience,
  Links,
} from "@/domain/types/instructor-details.type";

export interface GetTutorProfileResponseDTO {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  bio: string | null;
  headline: string | null;
  education: Education[];
  certificates: Certificate[];
  experiences: Experience[];
  skills: string[];
  links: Links;
  applicationStatus: ApplicationStatus;
  rejectionReason: string | null;
  isPlatformVerified: boolean;
  platformVerifiedAt: Date | null;
}