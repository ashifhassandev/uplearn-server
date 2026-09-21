import { Types } from "mongoose";
import { injectable } from "tsyringe";

import { GetTutorApplicationOutputDTO } from "../../application/dto/admin/get-tutor-application.dto";
import type {
  GetTutorApplicationsInputDTO,
  GetTutorApplicationsOutputDTO,
} from "../../application/dto/admin/get-tutor-applications.dto";
import { IAdminRepository } from "../../application/ports/repositories/admin.repository.interface";
import { ApplicationStatus } from "../../domain/enums/application-status.enum";
import { UserRole } from "../../domain/enums/user-role.enum";
import { InstructorDetailsModel } from "../database/models/instructor-details.model";
import { UserModel } from "../database/models/user.model";
import { UserDocument } from "../mappers/user.mapper";

@injectable()
export class AdminRepositoryImpl implements IAdminRepository {
  async findApplications(
    input: GetTutorApplicationsInputDTO,
  ): Promise<GetTutorApplicationsOutputDTO> {
    const { page, limit, search, status } = input;
    const skip = (page - 1) * limit;

    // Application filter
    const applicationQuery: Record<string, unknown> = {
      applicationStatus: status ?? ApplicationStatus.PENDING,
    };

    // User search filter
    const userQuery: Record<string, unknown> = {};
    if (search) {
      userQuery.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Resolve userIds if searching
    let userIdFilter: Record<string, unknown> = {};

    if (search) {
      const matchingUsers = await UserModel.find(userQuery)
        .select("_id")
        .exec();

      const userIds: Types.ObjectId[] = matchingUsers.map((u) => u._id);
      userIdFilter = { userId: { $in: userIds } };
    }

    const finalQuery = { ...applicationQuery, ...userIdFilter };

    // Fetch applications + count
    const [docs, total] = await Promise.all([
      InstructorDetailsModel.find(finalQuery)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("userId", "firstName lastName email profileImage")
        .exec(),

      InstructorDetailsModel.countDocuments(finalQuery).exec(),
    ]);

    // Map results safely
    const applications = docs.map((doc) => {
      const user = doc.userId as UserDocument | null;

      return {
        id: doc._id.toString(),
        userId: user?._id?.toString() ?? "",
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: user?.email ?? "",
        profileImage: user?.profileImage ?? null,
        headline: doc.headline ?? null,
        bio: doc.bio ?? null,
        skills: doc.skills ?? [],
        experiences: doc.experiences ?? [],
        education: doc.education ?? [],
        links: doc.links ?? {
          linkedin: null,
          portfolio: null,
          github: null,
        },
        applicationStatus: doc.applicationStatus as
          | "pending"
          | "approved"
          | "rejected",
        rejectionReason: doc.rejectionReason ?? null,
        createdAt: doc.createdAt,
      };
    });

    return {
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findApplicationById(
    applicationId: string,
  ): Promise<GetTutorApplicationOutputDTO | null> {
    const doc = await InstructorDetailsModel.findById(applicationId)
      .populate("userId", "firstName lastName email profileImage")
      .exec();

    if (!doc) return null;

    const user = doc.userId as UserDocument | null;

    return {
      id: doc._id.toString(),
      userId: user?._id?.toString() ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      profileImage: user?.profileImage ?? null,
      headline: doc.headline ?? null,
      bio: doc.bio ?? null,
      skills: doc.skills ?? [],
      experiences: doc.experiences ?? [],
      education: doc.education ?? [],
      certificates: doc.certificates ?? [],
      links: doc.links ?? {
        linkedin: null,
        portfolio: null,
        github: null,
      },
      applicationStatus: doc.applicationStatus as
        | "pending"
        | "approved"
        | "rejected",
      rejectionReason: doc.rejectionReason ?? null,
      createdAt: doc.createdAt,
    };
  }

  async approveTutor(applicationId: string): Promise<void> {
    const doc = await InstructorDetailsModel.findByIdAndUpdate(
      applicationId,
      {
        applicationStatus: ApplicationStatus.APPROVED,
        isApprovedByAdmin: true,
        approvedByAdminAt: new Date(),
      },
      { new: true },
    ).exec();

    if (!doc) return;

    await UserModel.findByIdAndUpdate(doc.userId, {
      role: UserRole.TUTOR,
    }).exec();
  }

  async rejectTutor(applicationId: string, reason: string): Promise<void> {
    await InstructorDetailsModel.findByIdAndUpdate(applicationId, {
      applicationStatus: ApplicationStatus.REJECTED,
      rejectionReason: reason,
    }).exec();
  }
}