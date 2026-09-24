import { StudentDetails } from "../../domain/entities/student-details.entity";
import { HttpStatus } from "../../shared/enums/http-status.enum";
import { AppError } from "../../shared/errors/app.error";

interface StudentDetailsDocument {
  _id: { toString(): string };
  userId: { toString(): string };
  coins?: number;
  badges?: { toString(): string }[];
  isPlatformVerified?: boolean;
  platformVerifiedAt?: Date | null;
}

export class StudentDetailsMapper {
  static toDomain(doc: StudentDetailsDocument): StudentDetails {
    if (!doc.userId) {
      throw new AppError(
        "Corrupted student details record",
        HttpStatus.SERVER_ERROR,
      );
    }

    return new StudentDetails(
      doc._id.toString(),
      doc.userId.toString(),
      doc.coins ?? 0,
      doc.badges?.map((b) => b.toString()) ?? [],
      doc.isPlatformVerified ?? false,
      doc.platformVerifiedAt ?? null,
    );
  }

  static toPersistence(
    studentDetails: StudentDetails,
  ): Record<string, unknown> {
    return {
      userId: studentDetails.userId,
      coins: studentDetails.coins,
      badges: studentDetails.badges,
      isPlatformVerified: studentDetails.isPlatformVerified,
      platformVerifiedAt: studentDetails.platformVerifiedAt,
    };
  }
}