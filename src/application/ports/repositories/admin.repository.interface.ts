import type { GetTutorApplicationOutputDTO } from "../../dto/admin/get-tutor-application.dto";
import type {
  GetTutorApplicationsInputDTO,
  GetTutorApplicationsOutputDTO,
} from "../../dto/admin/get-tutor-applications.dto";

export interface IAdminRepository {
  findApplications(
    input: GetTutorApplicationsInputDTO,
  ): Promise<GetTutorApplicationsOutputDTO>;
  findApplicationById(
    applicationId: string,
  ): Promise<GetTutorApplicationOutputDTO | null>;
  approveTutor(applicationId: string): Promise<void>;
  rejectTutor(applicationId: string, reason: string): Promise<void>;
}