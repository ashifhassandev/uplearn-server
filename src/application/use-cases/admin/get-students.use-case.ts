import { inject, injectable } from "tsyringe";

import { createLogger } from "../../../shared/logger/create-logger";
import { ILogger } from "../../../shared/logger/logger.interface";
import { ContextLogger } from "../../../shared/logger/logger-context.type";
import { TOKENS } from "../../constants/injection-token.constants";
import { LOG_ACTION, LOG_CONTEXT } from "../../constants/logger.constants";
import type {
  GetStudentsInputDTO,
  GetStudentsOutputDTO,
} from "../../dto/admin/get-students.dto";
import type { IUserRepository } from "../../ports/repositories/user.repository.interface";
import type { IGetStudentsUseCase } from "../../ports/use-cases/admin/get-students.use-case.interface";

@injectable()
export class GetStudentsUseCase implements IGetStudentsUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.ADMIN_STUDENT_USE_CASE);
  }

  async execute(input: GetStudentsInputDTO): Promise<GetStudentsOutputDTO> {
    this.log.attempt(LOG_ACTION.GET_STUDENTS, {
      page: input.page,
      limit: input.limit,
      search: input.search,
      status: input.status,
    });

    const result = await this._userRepository.findStudents(input);

    this.log.success(LOG_ACTION.GET_STUDENTS, {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });

    return result;
  }
}