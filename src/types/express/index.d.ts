import { RoleType } from "../../common/constants/roles.constants";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: RoleType;
      };
    }
  }
}

export {};
