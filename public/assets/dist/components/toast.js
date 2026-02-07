import { createElement, on, addClass, removeClass } from '../utils/dom-utils';
import { generateUID } from '../utils/common';
export class ToastManager {
    constructor() {
        this.toasts = new Map();
        this.maxToasts = 5;
        this.container = createElement('div', { id: 'toast-container' }, 'toast-container');
        document.body.appendChild(this.container);
    }
    static getInstance() {
        if (!ToastManager.instance) {
            ToastManager.instance = new ToastManager();
        }
        return ToastManager.instance;
    }
    show(message, type = 'info', duration = 3000) {
        if (this.toasts.size >= this.maxToasts) {
            const firstToast = this.toasts.values().next().value;
            if (firstToast) {
                firstToast.close();
            }
        }
        const toast = new Toast({ message, type, duration });
        this.container.appendChild(toast.getElement());
        this.toasts.set(toast.getId(), toast);
        toast.onClose(() => {
            this.toasts.delete(toast.getId());
        });
        return toast;
    }
    success(message, duration) {
        return this.show(message, 'success', duration);
    }
    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }
    info(message, duration) {
        return this.show(message, 'info', duration);
    }
    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }
    closeAll() {
        this.toasts.forEach(toast => toast.close());
    }
    getToasts() {
        return Array.from(this.toasts.values());
    }
}
export class Toast {
    constructor(options) {
        this.closeCallbacks = [];
        this.listeners = [];
        this.id = generateUID();
        this.message = options.message;
        this.type = options.type || 'info';
        this.duration = options.duration || 3000;
        this.element = createElement('div', { id: this.id, role: 'alert' }, `toast toast-${this.type}`);
        const icon = createElement('span', { class: `toast-icon toast-icon-${this.type}` });
        icon.innerHTML = this.getIcon();
        const messageEl = createElement('span', { class: 'toast-message' });
        messageEl.textContent = this.message;
        const closeBtn = createElement('button', {
            type: 'button',
            class: 'toast-close',
            'aria-label': 'إغلاق الإشعار'
        });
        closeBtn.innerHTML = '×';
        this.element.appendChild(icon);
        this.element.appendChild(messageEl);
        this.element.appendChild(closeBtn);
        this.listeners.push(on(closeBtn, 'click', () => this.close()));
        if (this.duration > 0) {
            this.timeout = setTimeout(() => this.close(), this.duration);
        }
        setTimeout(() => addClass(this.element, 'show'), 10);
    }
    getIcon() {
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ⓘ',
            warning: '⚠'
        };
        return icons[this.type];
    }
    getId() {
        return this.id;
    }
    getElement() {
        return this.element;
    }
    onClose(callback) {
        this.closeCallbacks.push(callback);
    }
    close() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        removeClass(this.element, 'show');
        setTimeout(() => {
            this.element.parentNode?.removeChild(this.element);
            this.listeners.forEach(listener => listener());
            this.listeners = [];
            this.closeCallbacks.forEach(callback => callback());
            this.closeCallbacks = [];
        }, 300);
    }
}
export const toastManager = ToastManager.getInstance();
