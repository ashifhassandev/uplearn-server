import { InstructorDetails } from "../../domain/entities/instructor-details.entity";
import { ApplicationStatus } from "../../domain/enums/application-status.enum";
import type {
  Certificate,
  Education,
  Experience,
  Links,
} from "../../domain/types/instructor-details.type";
import { HttpStatus } from "../../shared/enums/http-status.enum";
import { AppError } from "../../shared/errors/app.error";

interface InstructorDetailsDocument {
  _id: { toString(): string };
  userId: { toString(): string };
  bio?: string | null;
  headline?: string | null;
  education?: Education[];
  certificates?: Certificate[];
  experiences?: Experience[];
  skills?: string[];
  links?: Links;
  applicationStatus?: string | null;
  rejectionReason?: string | null;
  isApprovedByAdmin?: boolean;
  approvedByAdminAt?: Date | null;
  approvedByAdminId?: { toString(): string } | null;
  isPlatformVerified?: boolean;
  platformVerifiedAt?: Date | null;
}

export class InstructorDetailsMapper {
  static toDomain(doc: InstructorDetailsDocument): InstructorDetails {
    if (!doc.userId) {
      throw new AppError(
        "Corrupted instructor details record",
        HttpStatus.SERVER_ERROR,
      );
    }

    const applicationStatus = Object.values(ApplicationStatus).includes(
      doc.applicationStatus as ApplicationStatus,
    )
      ? (doc.applicationStatus as ApplicationStatus)
      : ApplicationStatus.PENDING;

    return new InstructorDetails(
      doc._id.toString(),
      doc.userId.toString(),
      doc.bio ?? null,
      doc.headline ?? null,
      doc.education ?? [],
      doc.certificates ?? [],
      doc.experiences ?? [],
      doc.skills ?? [],
      doc.links ?? { linkedin: null, portfolio: null, github: null },
      applicationStatus,
      doc.rejectionReason ?? null,
      doc.isApprovedByAdmin ?? false,
      doc.approvedByAdminAt ?? null,
      doc.approvedByAdminId?.toString() ?? null,
      doc.isPlatformVerified ?? false,
      doc.platformVerifiedAt ?? null,
    );
  }

  static toPersistence(entity: InstructorDetails): Record<string, unknown> {
    return {
      userId: entity.userId,
      bio: entity.bio,
      headline: entity.headline,
      education: entity.education,
      certificates: entity.certificates,
      experiences: entity.experiences,
      skills: entity.skills,
      links: entity.links,
      applicationStatus: entity.applicationStatus,
      rejectionReason: entity.rejectionReason,
      isApprovedByAdmin: entity.isApprovedByAdmin,
      approvedByAdminAt: entity.approvedByAdminAt,
      approvedByAdminId: entity.approvedByAdminId,
      isPlatformVerified: entity.isPlatformVerified,
      platformVerifiedAt: entity.platformVerifiedAt,
    };
  }
}