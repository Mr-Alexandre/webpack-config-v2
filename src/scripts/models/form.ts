export interface FormValidationError {
    errorFields: FormFieldMessage;
}

export interface FormFieldMessage {
    [key: string]: Array<string>;
}
