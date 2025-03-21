export type FormDataType = {
    [index: string]: string | number | boolean | null | undefined;
};

export type RegistrationFormData = {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    first_name: string | undefined;
    last_name: string | undefined;
}

export type LoginFormData = {
    username: string;
    password: string;
    remember_me: boolean | undefined;
};