import { injectable } from "tsyringe";

import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";

import { IInstructorDetailsRepository } from "../../application/ports/repositories/instructor-details.repository.interface";
import { InstructorDetails } from "../../domain/entities/instructor-details.entity";
import { InstructorDetailsModel } from "../database/models/instructor-details.model";
import { InstructorDetailsMapper } from "../mappers/instructor-details.mapper";

@injectable()
export class InstructorDetailsRepositoryImpl implements IInstructorDetailsRepository {
  async create(entity: InstructorDetails): Promise<InstructorDetails> {
    const doc = await InstructorDetailsModel.create(
      InstructorDetailsMapper.toPersistence(entity),
    );

    return InstructorDetailsMapper.toDomain(doc);
  }

  async findByUserId(userId: string): Promise<InstructorDetails | null> {
    const doc = await InstructorDetailsModel.findOne({ userId });
    if (!doc) return null;

    return InstructorDetailsMapper.toDomain(doc);
  }

  async updateByUserId(
    userId: string,
    entity: InstructorDetails,
  ): Promise<InstructorDetails> {
    const doc = await InstructorDetailsModel.findOneAndUpdate(
      { userId },
      { $set: InstructorDetailsMapper.toPersistence(entity) },
      { new: true },
    );
    if (!doc)
      throw new AppError("Instructor record not found", HttpStatus.NOT_FOUND);

    return InstructorDetailsMapper.toDomain(doc);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await InstructorDetailsModel.findOneAndDelete({ userId });
  }
}