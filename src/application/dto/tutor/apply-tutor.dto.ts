import type {
  Certificate,
  Education,
  Experience,
  Links,
} from "../../../domain/types/instructor-details.type";

export type ApplyTutorInputDTO = {
  userId: string;
  bio: string;
  headline: string;
  education: Education[];
  certificates: Certificate[];
  experiences: Experience[];
  skills: string[];
  links: Links;
};

export type ApplyTutorOutputDTO = {
  message: string;
  applicationStatus: string;
};