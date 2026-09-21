import type { TutorApplicationItem } from "./get-tutor-applications.dto";

export type GetTutorApplicationInputDTO = {
  applicationId: string;
};

export type GetTutorApplicationOutputDTO = TutorApplicationItem;