
export type User = {
    id: string;
    date_created: string | Date;
    date_updated: string | Date | null;
    last_login: string | Date | null;
    username: string;
    email_address: string;
    first_name: string | null;
    last_name: string | null;
    enabled: boolean;
    email_verified: boolean;
    roles: Array<Role> | null;
};

export type Role = {
    id: string;
    name: string;
    permissions: Array<Permission>;
};

export type Permission = {
    id: string;
    path: string;
};