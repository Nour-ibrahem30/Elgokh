export function getElementById(id) {
    return document.getElementById(id);
}
export function querySelector(selector, parent) {
    const element = parent?.querySelector(selector) ?? document.querySelector(selector);
    return element || null;
}
export function querySelectorAll(selector, parent) {
    const elements = parent?.querySelectorAll(selector) ?? document.querySelectorAll(selector);
    return Array.from(elements);
}
export function createElement(tag, attrs, className) {
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
export function on(element, event, handler) {
    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
}
export function addClass(element, ...classes) {
    element.classList.add(...classes);
}
export function removeClass(element, ...classes) {
    element.classList.remove(...classes);
}
export function toggleClass(element, className, force) {
    return element.classList.toggle(className, force);
}
export function hasClass(element, className) {
    return element.classList.contains(className);
}
export function setAttributes(element, attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
        if (value === false) {
            element.removeAttribute(key);
        }
        else {
            element.setAttribute(key, String(value));
        }
    });
}
export function remove(element) {
    element.parentNode?.removeChild(element);
}
export function clear(element) {
    element.innerHTML = '';
}
export function setText(element, text) {
    element.textContent = text;
}
export function setHTML(element, html) {
    element.innerHTML = html;
}
export function show(element, display = 'block') {
    element.style.display = display;
}
export function hide(element) {
    element.style.display = 'none';
}
export function isVisible(element) {
    return element.style.display !== 'none' &&
        window.getComputedStyle(element).display !== 'none';
}
export function focus(element) {
    element.focus();
}
export function getOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    };
}
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth));
}
