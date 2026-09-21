import type { InstructorDetails } from "../../../domain/entities/instructor-details.entity";
import type { IUserOwnedRepository } from "./base.repository.interface";

export interface IInstructorDetailsRepository extends IUserOwnedRepository<InstructorDetails> {
  create(entity: InstructorDetails): Promise<InstructorDetails>;
  findByUserId(userId: string): Promise<InstructorDetails | null>;
  updateByUserId(userId: string, entity: InstructorDetails): Promise<InstructorDetails>;
  deleteByUserId(userId: string): Promise<void>;
}