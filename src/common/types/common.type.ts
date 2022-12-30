export const RoleType = {
  admin: 1,
  user: 2,
};

export type AuthUserType = {
  id: number;
  role_id: number;
  email: string;
  access_token: string;
};
