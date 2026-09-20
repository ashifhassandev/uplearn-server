export {};
import type { UserStatus } from "@/domain/enums/user-status.enum";

import type { UserRole } from "../domain/enums/user-role.enum";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: UserRole;
      status: UserStatus;
    }
  }
}