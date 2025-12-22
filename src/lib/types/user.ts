import type { Role } from '@appTypes/role';
import type { FileUpload, FileUploadResponse } from '@appTypes/upload';

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  lastLogin: Date | null;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  enabled: boolean;
  emailVerified: boolean;
  thumbnail: FileUpload | null;
  roles: Array<Role>;
};

export type UserResponse = {
  id: string;
  created_at: Date;
  updated_at: Date | null;
  last_login: Date | null;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  enabled: boolean;
  email_verified: boolean;
  thumbnail: FileUploadResponse | null;
  roles: Array<Role>;
};
