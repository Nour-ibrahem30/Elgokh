export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    if (obj instanceof Object) {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    return obj;
}
export function merge(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, { [key]: {} });
                merge(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return merge(target, ...sources);
}
export function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
export function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}
export function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
export function generateUID() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
export function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    }
    catch (err) {
        console.error('Failed to copy:', err);
        throw err;
    }
}
export function scrollToElement(element, smooth = true) {
    element.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
}
export function getScrollPosition() {
    return {
        x: window.scrollX || window.pageXOffset,
        y: window.scrollY || window.pageYOffset
    };
}
export function isOnline() {
    return navigator.onLine;
}
export function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768)
        return 'mobile';
    if (width < 1024)
        return 'tablet';
    return 'desktop';
}
export async function retry(fn, maxAttempts = 3, delayMs = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            return await fn();
        }
        catch (error) {
            if (i === maxAttempts - 1)
                throw error;
            await delay(delayMs);
        }
    }
    throw new Error('Max retries exceeded');
}
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export function createCSV(data, columns) {
    const headers = columns.join(',');
    const rows = data.map(row => columns.map(col => row[col]).join(','));
    return [headers, ...rows].join('\n');
}
