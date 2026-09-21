import type { StudentDetails } from "../../../domain/entities/student-details.entity";
import type { IUserOwnedRepository } from "./base.repository.interface";

export interface IStudentDetailsRepository extends IUserOwnedRepository<StudentDetails> {
  create(userId: string): Promise<StudentDetails>;
}