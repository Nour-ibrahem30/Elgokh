/**
 * DOM Utilities
 * @description Common DOM manipulation utilities
 * @module utils/dom-utils
 */

/**
 * Safely get element by ID with type safety
 * @template T - Element type
 * @param {string} id - Element ID
 * @returns {T | null} Element or null if not found
 */
export function getElementById<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * Safely query selector with type safety
 * @template T - Element type
 * @param {string} selector - CSS selector
 * @param {HTMLElement} [parent] - Parent element to search within
 * @returns {T | null} Element or null if not found
 */
export function querySelector<T extends HTMLElement>(
  selector: string,
  parent?: HTMLElement
): T | null {
  const element = parent?.querySelector(selector) ?? document.querySelector(selector);
  return (element as T) || null;
}

/**
 * Query all elements matching selector
 * @template T - Element type
 * @param {string} selector - CSS selector
 * @param {HTMLElement} [parent] - Parent element to search within
 * @returns {T[]} Array of elements
 */
export function querySelectorAll<T extends HTMLElement>(
  selector: string,
  parent?: HTMLElement
): T[] {
  const elements = parent?.querySelectorAll(selector) ?? document.querySelectorAll(selector);
  return Array.from(elements) as T[];
}

/**
 * Create element with optional attributes
 * @template K - Element tag name
 * @param {K} tag - HTML tag name
 * @param {Record<string, string>} [attrs] - Attributes to set
 * @param {string} [className] - CSS classes
 * @returns {HTMLElementTagNameMap[K]} Created element
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  className?: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  return element;
}

/**
 * Add event listener with automatic cleanup
 * @param {HTMLElement} element - Target element
 * @param {string} event - Event type
 * @param {EventListener} handler - Event handler
 * @returns {() => void} Function to remove listener
 */
export function on(
  element: HTMLElement | Window | Document,
  event: string,
  handler: EventListener
): () => void {
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
}

/**
 * Add class to element
 * @param {HTMLElement} element - Target element
 * @param {...string[]} classes - Classes to add
 */
export function addClass(element: HTMLElement, ...classes: string[]): void {
  element.classList.add(...classes);
}

/**
 * Remove class from element
 * @param {HTMLElement} element - Target element
 * @param {...string[]} classes - Classes to remove
 */
export function removeClass(element: HTMLElement, ...classes: string[]): void {
  element.classList.remove(...classes);
}

/**
 * Toggle class on element
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class name
 * @param {boolean} [force] - Force add/remove
 * @returns {boolean} Whether class is present after toggle
 */
export function toggleClass(element: HTMLElement, className: string, force?: boolean): boolean {
  return element.classList.toggle(className, force);
}

/**
 * Check if element has class
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class name
 * @returns {boolean} Whether element has class
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * Set multiple attributes
 * @param {HTMLElement} element - Target element
 * @param {Record<string, string | number | boolean>} attrs - Attributes to set
 */
export function setAttributes(
  element: HTMLElement,
  attrs: Record<string, string | number | boolean>
): void {
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === false) {
      element.removeAttribute(key);
    } else {
      element.setAttribute(key, String(value));
    }
  });
}

/**
 * Remove element from DOM
 * @param {HTMLElement} element - Element to remove
 */
export function remove(element: HTMLElement): void {
  element.parentNode?.removeChild(element);
}

/**
 * Clear element content
 * @param {HTMLElement} element - Target element
 */
export function clear(element: HTMLElement): void {
  element.innerHTML = '';
}

/**
 * Set text content safely
 * @param {HTMLElement} element - Target element
 * @param {string} text - Text content
 */
export function setText(element: HTMLElement, text: string): void {
  element.textContent = text;
}

/**
 * Set HTML content safely (use with caution)
 * @param {HTMLElement} element - Target element
 * @param {string} html - HTML content
 */
export function setHTML(element: HTMLElement, html: string): void {
  element.innerHTML = html;
}

/**
 * Show element
 * @param {HTMLElement} element - Target element
 * @param {string} [display] - Display value (default: 'block')
 */
export function show(element: HTMLElement, display: string = 'block'): void {
  element.style.display = display;
}

/**
 * Hide element
 * @param {HTMLElement} element - Target element
 */
export function hide(element: HTMLElement): void {
  element.style.display = 'none';
}

/**
 * Check if element is visible
 * @param {HTMLElement} element - Target element
 * @returns {boolean} Whether element is visible
 */
export function isVisible(element: HTMLElement): boolean {
  return element.style.display !== 'none' &&
    window.getComputedStyle(element).display !== 'none';
}

/**
 * Focus element
 * @param {HTMLElement} element - Target element
 */
export function focus(element: HTMLElement): void {
  element.focus();
}

/**
 * Get element offset position
 * @param {HTMLElement} element - Target element
 * @returns {{top: number, left: number}} Offset position
 */
export function getOffset(element: HTMLElement): { top: number; left: number } {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX
  };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Target element
 * @returns {boolean} Whether element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
