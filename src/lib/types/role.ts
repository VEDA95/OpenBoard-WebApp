export type Permission = {
  id: string;
  path: string;
};

export type Role = {
  id: string;
  name: string;
  permissions: Array<Permission>;
};
