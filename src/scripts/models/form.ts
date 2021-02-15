export type TFormValidationError = {
    errorFields: TFormFieldMessage;
}

export type TFormFieldMessage = {
    [key: string]: Array<string>;
}
