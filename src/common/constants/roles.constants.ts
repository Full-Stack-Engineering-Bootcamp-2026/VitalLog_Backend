export const ROLES = {
  MEMBER: "MEMBER",
  STAFF: "STAFF",
  ADMIN: "ADMIN",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
