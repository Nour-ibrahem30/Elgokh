// Toast System Type Definitions
declare global {
    interface Window {
        toastSystem: any;
        showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
        showSuccess: (message: string, duration?: number) => void;
        showError: (message: string, duration?: number) => void;
        showWarning: (message: string, duration?: number) => void;
        showInfo: (message: string, duration?: number) => void;
        showConfirmDialog: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
    }
}

declare function showToast(message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number): void;
declare function showSuccess(message: string, duration?: number): void;
declare function showError(message: string, duration?: number): void;
declare function showWarning(message: string, duration?: number): void;
declare function showInfo(message: string, duration?: number): void;
declare function showConfirmDialog(message: string, onConfirm: () => void, onCancel?: () => void): void;

export {};