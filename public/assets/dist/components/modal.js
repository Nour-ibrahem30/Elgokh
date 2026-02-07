import { createElement, on, addClass, removeClass, setAttributes } from '../utils/dom-utils';
import { generateUID } from '../utils/common';
export class Modal {
    constructor(options = {}) {
        this.closeListeners = [];
        this.modalId = generateUID();
        this.onClose = options.onClose;
        this.backdrop = createElement('div', { id: `modal-backdrop-${this.modalId}` }, 'modal-backdrop');
        this.modal = createElement('div', { id: `modal-${this.modalId}`, role: 'dialog' }, 'modal');
        this.dialogElement = createElement('div', {}, 'modal-dialog');
        this.titleElement = createElement('h2', { id: `modal-title-${this.modalId}` }, 'modal-title');
        this.contentElement = createElement('div', {}, 'modal-content');
        this.actionsElement = createElement('div', {}, 'modal-actions');
        this.closeBtn = createElement('button', {
            type: 'button',
            'aria-label': 'إغلاق',
            class: 'modal-close'
        }, 'modal-close-btn');
        this.closeBtn.innerHTML = '×';
        setAttributes(this.modal, {
            'aria-labelledby': `modal-title-${this.modalId}`,
            'aria-modal': 'true'
        });
        this.modal.appendChild(this.closeBtn);
        this.dialogElement.appendChild(this.titleElement);
        this.dialogElement.appendChild(this.contentElement);
        this.dialogElement.appendChild(this.actionsElement);
        this.modal.appendChild(this.dialogElement);
        if (options.title) {
            this.setTitle(options.title);
        }
        if (options.content) {
            this.setContent(options.content);
        }
        if (options.actions) {
            this.setActions(options.actions);
        }
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.closeListeners.push(on(this.closeBtn, 'click', () => this.close()));
        this.closeListeners.push(on(this.backdrop, 'click', (e) => {
            if (e.target === this.backdrop) {
                this.close();
            }
        }));
        this.closeListeners.push(on(document, 'keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        }));
    }
    setTitle(title) {
        this.titleElement.textContent = title;
    }
    setContent(content) {
        if (typeof content === 'string') {
            this.contentElement.innerHTML = content;
        }
        else {
            this.contentElement.innerHTML = '';
            this.contentElement.appendChild(content);
        }
    }
    setActions(actions) {
        this.actionsElement.innerHTML = '';
        actions.forEach(action => {
            const button = createElement('button', {
                type: 'button',
                class: `modal-action-btn modal-action-${action.variant || 'primary'}`
            });
            button.textContent = action.label;
            button.disabled = action.disabled || false;
            this.closeListeners.push(on(button, 'click', async () => {
                button.disabled = true;
                try {
                    await action.onClick();
                }
                finally {
                    button.disabled = false;
                }
            }));
            this.actionsElement.appendChild(button);
        });
    }
    open() {
        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.modal);
        addClass(this.modal, 'active');
        addClass(this.backdrop, 'active');
        this.closeBtn.focus();
        document.body.style.overflow = 'hidden';
    }
    close() {
        removeClass(this.modal, 'active');
        removeClass(this.backdrop, 'active');
        setTimeout(() => {
            this.backdrop.parentNode?.removeChild(this.backdrop);
            this.modal.parentNode?.removeChild(this.modal);
            document.body.style.overflow = '';
            if (this.onClose) {
                this.onClose();
            }
        }, 300);
    }
    isOpen() {
        return document.body.contains(this.modal);
    }
    destroy() {
        this.closeListeners.forEach(listener => listener());
        this.closeListeners = [];
        if (this.isOpen()) {
            this.backdrop.parentNode?.removeChild(this.backdrop);
            this.modal.parentNode?.removeChild(this.modal);
        }
        document.body.style.overflow = '';
    }
    getElement() {
        return this.modal;
    }
}
