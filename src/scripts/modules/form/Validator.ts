import {FormValidationError} from "../../models/form";

export default class FieldGroup {
    private CLASS_FIELD_GROUP: string = 'js-fieldGroup';
    private CLASS_FIELD_GROUP_MESSAGE: string = 'js-fieldGroupMessage';
    private CLASS_FIELD_GROUP_ERROR: string = 'is-invalid';
    private CLASS_FIELD_GROUP_SUCCESS: string = 'is-valid';

    public validate(scope: HTMLElement, error: FormValidationError): FieldGroup {
        const allErrorsField: HTMLCollectionOf<Element> = scope.getElementsByClassName(this.CLASS_FIELD_GROUP_ERROR);
        Array.from(allErrorsField).forEach((element: HTMLElement) => {
            element.classList.remove(this.CLASS_FIELD_GROUP_ERROR);
        });
        for (const name in error.errorFields) {
            const errorField: HTMLElement = (
                scope
                    .querySelector(
                        `.${this.CLASS_FIELD_GROUP} [name="${name}"], .${this.CLASS_FIELD_GROUP} [name="${name}[]"]`
                    )
                    .closest(`.${this.CLASS_FIELD_GROUP}`)
            ) as HTMLElement;
            const errorFieldMessage: HTMLElement = errorField.querySelector(
                `.${this.CLASS_FIELD_GROUP_MESSAGE}`
            );
            errorFieldMessage.textContent = error.errorFields[name][0];
            errorField.classList.add(this.CLASS_FIELD_GROUP_ERROR);
        }
        return this;
    }

    public clear(scope: HTMLElement): FieldGroup {
        const allFields: HTMLCollectionOf<Element> = scope.getElementsByClassName(this.CLASS_FIELD_GROUP);
        Array.from(allFields).forEach((element: HTMLElement) => {
            const inputs: Array<HTMLInputElement> = Array.from(
                element.querySelectorAll(`input:not([type=checkbox]):not([type=radio])`)
            );
            inputs.forEach((input) => {
                input.value = '';
            });
            const textareas: Array<HTMLTextAreaElement> = Array.from(
                element.querySelectorAll(`textarea`)
            );
            textareas.forEach((textarea) => {
                textarea.value = '';
            });
            const checkedElements: Array<HTMLInputElement> = Array.from(
                element.querySelectorAll(`input[type=checkbox], input[type=radio]`)
            );
            checkedElements.forEach((check) => {
                check.checked = false;
            });
            element.classList.remove(this.CLASS_FIELD_GROUP_ERROR);
            element.classList.remove(this.CLASS_FIELD_GROUP_SUCCESS);
        });
        return this;
    }
}
