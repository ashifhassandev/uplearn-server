import type { User } from "../../../domain/entities/user.entity";
import type { UserStatus } from "../../../domain/enums/user-status.enum";
import type {
  GetStudentsInputDTO,
  GetStudentsOutputDTO,
  StudentResponseDTO,
} from "../../dto/admin/get-students.dto";
import type {
  GetTutorsInputDTO,
  GetTutorsOutputDTO,
  TutorDetailsResponseDTO,
} from "../../dto/admin/get-tutors.dto";
import type { IBaseRepository } from "./base.repository.interface";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  updateLastLogin(userId: string): Promise<void>;
  updateStatus(userId: string, status: UserStatus): Promise<void>;
  updateProfileImage(userId: string, profileImage: string): Promise<void>;
  findStudents(input: GetStudentsInputDTO): Promise<GetStudentsOutputDTO>;
  findStudentById(studentId: string): Promise<StudentResponseDTO | null>;
  findTutors(input: GetTutorsInputDTO): Promise<GetTutorsOutputDTO>;
  findTutorById(tutorId: string): Promise<TutorDetailsResponseDTO>;
}