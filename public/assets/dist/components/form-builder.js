import { createElement, on, setAttributes, addClass, removeClass, querySelector } from '../utils/dom-utils';
import { validateRequired } from '../utils/validation';
import { generateUID } from '../utils/common';
export class FormBuilder {
    constructor(options = {}) {
        this.fields = new Map();
        this.fieldElements = new Map();
        this.listeners = [];
        this.state = {
            fields: {},
            isSubmitting: false,
            isValid: false,
            errors: {}
        };
        this.formId = options.id || generateUID();
        this.formElement = createElement('form', { id: this.formId }, options.className || 'form-builder');
        this.onSubmit = options.onSubmit;
        this.listeners.push(on(this.formElement, 'submit', (e) => this.handleSubmit(e)));
    }
    addField(field) {
        this.fields.set(field.name, field);
        this.state.fields[field.name] = field;
        this.renderField(field);
        return this;
    }
    addFields(fields) {
        fields.forEach(field => this.addField(field));
        return this;
    }
    renderField(field) {
        const fieldContainer = createElement('div', { class: 'form-group' });
        const label = createElement('label', { for: field.name });
        label.textContent = field.label;
        if (field.required) {
            const required = createElement('span', { class: 'required' });
            required.textContent = '*';
            label.appendChild(required);
        }
        let input;
        switch (field.type) {
            case 'textarea':
                input = createElement('textarea', { id: field.name, name: field.name });
                input.placeholder = field.placeholder || '';
                input.value = field.value || '';
                break;
            case 'select':
                input = createElement('select', { id: field.name, name: field.name });
                field.options?.forEach(option => {
                    const optionEl = createElement('option', { value: option.value });
                    optionEl.textContent = option.label;
                    input.appendChild(optionEl);
                });
                input.value = field.value || '';
                break;
            case 'checkbox':
            case 'radio':
                input = createElement('div', { class: 'checkbox-group' });
                field.options?.forEach(option => {
                    const wrapper = createElement('div', { class: `${field.type}-wrapper` });
                    const checkbox = createElement('input', {
                        type: field.type,
                        id: `${field.name}-${option.value}`,
                        name: field.name,
                        value: option.value
                    });
                    const label = createElement('label', { for: `${field.name}-${option.value}` });
                    label.textContent = option.label;
                    wrapper.appendChild(checkbox);
                    wrapper.appendChild(label);
                    input.appendChild(wrapper);
                });
                break;
            case 'file':
                input = createElement('input', {
                    type: 'file',
                    id: field.name,
                    name: field.name
                });
                break;
            default:
                input = createElement('input', {
                    type: field.type,
                    id: field.name,
                    name: field.name
                });
                input.placeholder = field.placeholder || '';
                input.value = field.value || '';
        }
        if (field.required) {
            setAttributes(input, { 'aria-required': 'true' });
        }
        this.listeners.push(on(input, 'blur', () => this.validateField(field.name)));
        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
        const errorContainer = createElement('div', { class: 'form-error' });
        fieldContainer.appendChild(errorContainer);
        this.formElement.appendChild(fieldContainer);
        this.fieldElements.set(field.name, fieldContainer);
    }
    addSubmitButton(options) {
        this.submitBtn = createElement('button', {
            type: 'submit',
            class: options.className || 'btn-primary'
        });
        this.submitBtn.textContent = options.label;
        this.formElement.appendChild(this.submitBtn);
        return this;
    }
    validateField(fieldName) {
        const field = this.fields.get(fieldName);
        if (!field)
            return false;
        const input = querySelector(`#${fieldName}`, this.formElement);
        if (!input)
            return false;
        const value = this.getFieldValue(fieldName);
        let error;
        if (field.required) {
            const result = validateRequired(value, field.label);
            if (!result.isValid) {
                error = result.error;
            }
        }
        if (!error && field.validate) {
            const customResult = field.validate(value);
            if (typeof customResult === 'string') {
                error = customResult;
            }
            else if (!customResult) {
                error = 'قيمة غير صحيحة';
            }
        }
        this.state.errors[fieldName] = error || '';
        const fieldContainer = this.fieldElements.get(fieldName);
        if (fieldContainer) {
            const errorEl = querySelector('.form-error', fieldContainer);
            if (errorEl) {
                errorEl.textContent = error || '';
                if (error) {
                    addClass(fieldContainer, 'has-error');
                }
                else {
                    removeClass(fieldContainer, 'has-error');
                }
            }
        }
        return !error;
    }
    validateForm() {
        let isValid = true;
        this.fields.forEach((_, fieldName) => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        this.state.isValid = isValid;
        return isValid;
    }
    getFieldValue(fieldName) {
        const input = querySelector(`#${fieldName}`, this.formElement);
        if (!input)
            return null;
        if (input instanceof HTMLInputElement) {
            if (input.type === 'checkbox' || input.type === 'radio') {
                return input.checked;
            }
            return input.value;
        }
        return input.value;
    }
    getFormData() {
        const data = {};
        this.fields.forEach((_, fieldName) => {
            data[fieldName] = this.getFieldValue(fieldName);
        });
        return data;
    }
    setFieldValue(fieldName, value) {
        const input = querySelector(`#${fieldName}`, this.formElement);
        if (input) {
            input.value = value;
            const field = this.fields.get(fieldName);
            if (field) {
                field.value = value;
            }
        }
    }
    async handleSubmit(e) {
        e.preventDefault();
        if (!this.validateForm()) {
            return;
        }
        this.state.isSubmitting = true;
        if (this.submitBtn) {
            this.submitBtn.disabled = true;
        }
        try {
            const data = this.getFormData();
            if (this.onSubmit) {
                await this.onSubmit(data);
            }
        }
        catch (error) {
            console.error('Form submission error:', error);
        }
        finally {
            this.state.isSubmitting = false;
            if (this.submitBtn) {
                this.submitBtn.disabled = false;
            }
        }
    }
    reset() {
        this.formElement.reset();
        this.state.errors = {};
        this.fieldElements.forEach((fieldEl) => {
            removeClass(fieldEl, 'has-error');
        });
    }
    getElement() {
        return this.formElement;
    }
    getState() {
        return { ...this.state };
    }
    destroy() {
        this.listeners.forEach(listener => listener());
        this.listeners = [];
        this.fieldElements.clear();
        this.fields.clear();
        this.formElement.parentNode?.removeChild(this.formElement);
    }
}
