import { injectable } from "tsyringe";

import {
  GetStudentsInputDTO,
  GetStudentsOutputDTO,
  StudentResponseDTO,
} from "../../application/dto/admin/get-students.dto";
import {
  GetTutorsInputDTO,
  GetTutorsOutputDTO,
  TutorDetailsResponseDTO,
} from "../../application/dto/admin/get-tutors.dto";
import { IUserRepository } from "../../application/ports/repositories/user.repository.interface";
import { User } from "../../domain/entities/user.entity";
import { UserRole } from "../../domain/enums/user-role.enum";
import { UserStatus } from "../../domain/enums/user-status.enum";
import { DB_ERRORS } from "../../shared/constants/messages.constants";
import { HttpStatus } from "../../shared/enums/http-status.enum";
import { AppError } from "../../shared/errors/app.error";
import { InstructorDetailsModel } from "../database/models/instructor-details.model";
import { UserModel } from "../database/models/user.model";
import { InstructorDetailsMapper } from "../mappers/instructor-details.mapper";
import { UserMapper } from "../mappers/user.mapper";

@injectable()
export class UserRepositoryImpl implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;

    return UserMapper.toDomain(doc);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    if (!doc) return null;

    return UserMapper.toDomain(doc);
  }

  async save(user: User): Promise<User> {
    const doc = await UserModel.create(UserMapper.toPersistence(user));
    return UserMapper.toDomain(doc);
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { lastLogin: new Date() });
  }

  async updateStatus(userId: string, status: UserStatus): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { status });
  }

  async updateProfileImage(
    userId: string,
    profileImage: string,
  ): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { profileImage });
  }

  // Search Query Helper
  private buildSearchQuery(search: string | null): Record<string, unknown> {
    if (!search) return {};

    return {
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
  }

  // Find Students
  async findStudents(
    input: GetStudentsInputDTO,
  ): Promise<GetStudentsOutputDTO> {
    const { page, limit, search, status } = input;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {
      role: UserRole.STUDENT,
      ...this.buildSearchQuery(search),
    };

    if (status) query.status = status;

    const [docs, total] = await Promise.all([
      UserModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      UserModel.countDocuments(query),
    ]);

    const students = docs.map((doc) => {
      const user = UserMapper.toDomain(doc);
      if (!user.id) {
        throw new AppError(
          DB_ERRORS.CORRUPTED_USER_RECORD,
          HttpStatus.SERVER_ERROR,
        );
      }

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin,
        createdAt: doc.createdAt,
      };
    });

    return {
      students,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findStudentById(studentId: string): Promise<StudentResponseDTO | null> {
    const doc = await UserModel.findOne({
      _id: studentId,
      role: UserRole.STUDENT,
    });
    if (!doc) return null;

    const user = UserMapper.toDomain(doc);
    if (!user.id) {
      throw new AppError(
        DB_ERRORS.CORRUPTED_USER_RECORD,
        HttpStatus.SERVER_ERROR,
      );
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImage: user.profileImage,
      role: UserRole.STUDENT,
      status: user.status,
      lastLogin: user.lastLogin,
      createdAt: doc.createdAt,
    };
  }

  // Find Tutors
  async findTutors(input: GetTutorsInputDTO): Promise<GetTutorsOutputDTO> {
    const { page, limit, search, status, verified } = input;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {
      role: UserRole.TUTOR,
      ...this.buildSearchQuery(search),
    };

    if (status) query.status = status;

    const [docs, total] = await Promise.all([
      UserModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      UserModel.countDocuments(query),
    ]);

    // Extract all user IDs
    const userIds = docs.map((doc) => doc._id);

    // ONE query for all instructor details
    const instructorDetailsDocs = await InstructorDetailsModel.find({
      userId: { $in: userIds },
    });

    // Map userId → instructorDetails for O(1) lookup
    const instructorDetailsMap = new Map(
      instructorDetailsDocs.map((details) => [
        details.userId.toString(),
        details,
      ]),
    );

    const tutors = docs.map((doc) => {
      const user = UserMapper.toDomain(doc);
      if (!user.id) {
        throw new AppError(
          DB_ERRORS.CORRUPTED_USER_RECORD,
          HttpStatus.SERVER_ERROR,
        );
      }

      // O(1) lookup
      const instructorDetails = instructorDetailsMap.get(user.id);
      const isVerified = instructorDetails?.isApprovedByAdmin ?? false;

      // Apply verified filter
      if (verified === "true" && !isVerified) return null;
      if (verified === "false" && isVerified) return null;

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        status: user.status,
        isVerified,
        courseCount: 0,
        rating: null,
        lastLogin: user.lastLogin,
        createdAt: doc.createdAt,
      };
    });

    // Remove nulls from verified filter
    const filteredTutors = tutors.filter(
      (t): t is NonNullable<typeof t> => t !== null,
    );

    return {
      tutors: filteredTutors,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findTutorById(tutorId: string): Promise<TutorDetailsResponseDTO> {
    const instructorDoc = await InstructorDetailsModel.findOne({
      userId: tutorId,
    });
    if (!instructorDoc) {
      throw new AppError("Instructor details not found", HttpStatus.NOT_FOUND);
    }

    const instructor = InstructorDetailsMapper.toDomain(instructorDoc);
    if (!instructor.id) {
      throw new AppError("Instructor ID is missing", HttpStatus.SERVER_ERROR);
    }

    const userDoc = await UserModel.findById(tutorId);
    if (!userDoc) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND);
    }

    return {
      id: instructor.id,
      userId: instructor.userId,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      email: userDoc.email,
      profileImage: userDoc.profileImage ?? null,
      headline: instructor.headline ?? "",
      bio: instructor.bio ?? "",
      skills: instructor.skills ?? [],
      experiences: instructor.experiences ?? [],
      education: instructor.education ?? [],
      certificates: instructor.certificates
        .filter((c) => c.key)
        .map((c) => ({
          key: c.key as string,
        })),
      isVerified: instructor.isApprovedByAdmin,
      status: userDoc.status as UserStatus,
      lastLogin: userDoc.lastLogin ?? null,
      createdAt: userDoc.createdAt,
    };
  }
}