/**
 * Modal Component
 * @description Reusable modal dialog component with accessibility features
 * @module components/modal
 */

import { createElement, on, addClass, removeClass, setAttributes } from '../utils/dom-utils';
import { generateUID } from '../utils/common';
import type { ModalAction } from '../types';

/**
 * Modal Component Class
 * Provides a reusable, accessible modal dialog
 */
export class Modal {
  private modal: HTMLDivElement;
  private backdrop: HTMLDivElement;
  private dialogElement: HTMLDivElement;
  private titleElement: HTMLHeadingElement;
  private contentElement: HTMLDivElement;
  private actionsElement: HTMLDivElement;
  private closeBtn: HTMLButtonElement;
  private modalId: string;
  private onClose?: () => void;
  private closeListeners: (() => void)[] = [];

  /**
   * Create a new Modal instance
   * @param {Object} options - Modal options
   * @param {string} [options.title] - Modal title
   * @param {string | HTMLElement} [options.content] - Modal content
   * @param {ModalAction[]} [options.actions] - Modal actions
   * @param {() => void} [options.onClose] - Close callback
   */
  constructor(options: {
    title?: string;
    content?: string | HTMLElement;
    actions?: ModalAction[];
    onClose?: () => void;
  } = {}) {
    this.modalId = generateUID();
    this.onClose = options.onClose;

    // Create modal structure
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

    // Set ARIA attributes
    setAttributes(this.modal, {
      'aria-labelledby': `modal-title-${this.modalId}`,
      'aria-modal': 'true'
    });

    // Build structure
    this.modal.appendChild(this.closeBtn);
    this.dialogElement.appendChild(this.titleElement);
    this.dialogElement.appendChild(this.contentElement);
    this.dialogElement.appendChild(this.actionsElement);
    this.modal.appendChild(this.dialogElement);

    // Set content
    if (options.title) {
      this.setTitle(options.title);
    }
    if (options.content) {
      this.setContent(options.content);
    }
    if (options.actions) {
      this.setActions(options.actions);
    }

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Close button
    this.closeListeners.push(
      on(this.closeBtn, 'click', () => this.close())
    );

    // Backdrop click
    this.closeListeners.push(
      on(this.backdrop, 'click', (e) => {
        if (e.target === this.backdrop) {
          this.close();
        }
      })
    );

    // Escape key
    this.closeListeners.push(
      on(document, 'keydown', (e: any) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      })
    );
  }

  /**
   * Set modal title
   * @param {string} title - Title text
   */
  setTitle(title: string): void {
    this.titleElement.textContent = title;
  }

  /**
   * Set modal content
   * @param {string | HTMLElement} content - Content
   */
  setContent(content: string | HTMLElement): void {
    if (typeof content === 'string') {
      this.contentElement.innerHTML = content;
    } else {
      this.contentElement.innerHTML = '';
      this.contentElement.appendChild(content);
    }
  }

  /**
   * Set modal actions
   * @param {ModalAction[]} actions - Actions to add
   */
  setActions(actions: ModalAction[]): void {
    this.actionsElement.innerHTML = '';
    actions.forEach(action => {
      const button = createElement('button', {
        type: 'button',
        class: `modal-action-btn modal-action-${action.variant || 'primary'}`
      });
      button.textContent = action.label;
      button.disabled = action.disabled || false;

      this.closeListeners.push(
        on(button, 'click', async () => {
          button.disabled = true;
          try {
            await action.onClick();
          } finally {
            button.disabled = false;
          }
        })
      );

      this.actionsElement.appendChild(button);
    });
  }

  /**
   * Open modal
   */
  open(): void {
    document.body.appendChild(this.backdrop);
    document.body.appendChild(this.modal);
    addClass(this.modal, 'active');
    addClass(this.backdrop, 'active');

    // Focus on close button
    this.closeBtn.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close modal
   */
  close(): void {
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

  /**
   * Check if modal is open
   * @returns {boolean} Whether modal is open
   */
  isOpen(): boolean {
    return document.body.contains(this.modal);
  }

  /**
   * Destroy modal and cleanup
   */
  destroy(): void {
    this.closeListeners.forEach(listener => listener());
    this.closeListeners = [];

    if (this.isOpen()) {
      this.backdrop.parentNode?.removeChild(this.backdrop);
      this.modal.parentNode?.removeChild(this.modal);
    }

    document.body.style.overflow = '';
  }

  /**
   * Get modal element
   * @returns {HTMLDivElement} Modal element
   */
  getElement(): HTMLDivElement {
    return this.modal;
  }
}
