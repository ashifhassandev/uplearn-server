import { injectable } from "tsyringe";

import { IStudentDetailsRepository } from "../../application/ports/repositories/student-details.repository.interface";
import { StudentDetails } from "../../domain/entities/student-details.entity";
import { StudentDetailsModel } from "../database/models/student-details.model";
import { StudentDetailsMapper } from "../mappers/student-details.mapper";

@injectable()
export class StudentDetailsRepositoryImpl implements IStudentDetailsRepository {
  async create(userId: string): Promise<StudentDetails> {
    const doc = await StudentDetailsModel.create({ userId });
    return StudentDetailsMapper.toDomain(doc);
  }

  async findByUserId(userId: string): Promise<StudentDetails | null> {
    const doc = await StudentDetailsModel.findOne({ userId });
    if (!doc) return null;

    return StudentDetailsMapper.toDomain(doc);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await StudentDetailsModel.findOneAndDelete({ userId });
  }
}