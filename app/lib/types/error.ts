
export type ValidationError = {
    err_value: string;
    failed_field: string;
    tag: string;
    value: string;
};

export type ValidationErrors = {
    [index: string]: ValidationError;
};