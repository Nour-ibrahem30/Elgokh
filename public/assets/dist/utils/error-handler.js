export var ErrorType;
(function (ErrorType) {
    ErrorType["AUTHENTICATION"] = "AUTHENTICATION";
    ErrorType["AUTHORIZATION"] = "AUTHORIZATION";
    ErrorType["VALIDATION"] = "VALIDATION";
    ErrorType["NETWORK"] = "NETWORK";
    ErrorType["DATABASE"] = "DATABASE";
    ErrorType["FILE_UPLOAD"] = "FILE_UPLOAD";
    ErrorType["UNKNOWN"] = "UNKNOWN";
})(ErrorType || (ErrorType = {}));
export class AppError extends Error {
    constructor(message, type = ErrorType.UNKNOWN, code, additionalData) {
        super(message);
        this.message = message;
        this.type = type;
        this.code = code;
        this.additionalData = additionalData;
        this.name = 'AppError';
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
export class ErrorHandler {
    static async handle(error, context) {
        const errorContext = this.parseError(error, context);
        this.storeError(errorContext);
        if (this.isDevelopment) {
            console.error('Error:', errorContext);
        }
        if (!this.isDevelopment) {
            await this.sendToServer(errorContext);
        }
        this.notifyUser(errorContext);
    }
    static parseError(error, context) {
        let errorContext = {
            message: 'حدث خطأ غير متوقع',
            type: ErrorType.UNKNOWN,
            timestamp: new Date(),
            context,
        };
        if (error instanceof AppError) {
            errorContext = {
                message: error.message,
                type: error.type,
                code: error.code,
                additionalData: error.additionalData,
                timestamp: new Date(),
                context,
            };
        }
        else if (error instanceof Error) {
            errorContext.message = error.message;
            errorContext.code = error.name;
        }
        else if (typeof error === 'string') {
            errorContext.message = error;
        }
        else if (error?.response) {
            errorContext.type = ErrorType.NETWORK;
            errorContext.message = error.response.data?.message || error.message;
            errorContext.code = error.response.status?.toString();
        }
        return errorContext;
    }
    static storeError(errorContext) {
        this.errorLog.push(errorContext);
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog = this.errorLog.slice(-this.maxLogSize);
        }
    }
    static async sendToServer(errorContext) {
        try {
            await fetch('/api/logs/errors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(errorContext),
            });
        }
        catch (err) {
            console.error('Failed to send error to server:', err);
        }
    }
    static notifyUser(errorContext) {
        const message = errorContext.message || 'حدث خطأ. يرجى محاولة مرة أخرى.';
        window.dispatchEvent(new CustomEvent('app-error', { detail: { message, type: 'error' } }));
    }
    static log(message, data) {
        if (this.isDevelopment) {
            console.log(`[LOG] ${message}`, data || '');
        }
        this.storeLog('INFO', message, data);
    }
    static warn(message, data) {
        if (this.isDevelopment) {
            console.warn(`[WARN] ${message}`, data || '');
        }
        this.storeLog('WARN', message, data);
    }
    static logError(message, data) {
        if (this.isDevelopment) {
            console.error(`[ERROR] ${message}`, data || '');
        }
        this.storeLog('ERROR', message, data);
    }
    static debug(message, data) {
        if (this.isDevelopment) {
            console.debug(`[DEBUG] ${message}`, data || '');
        }
    }
    static storeLog(level, message, data) {
        this.errorLog.push({
            message: `[${level}] ${message}`,
            timestamp: new Date(),
            additionalData: data,
        });
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog = this.errorLog.slice(-this.maxLogSize);
        }
    }
    static getLogs() {
        return [...this.errorLog];
    }
    static clearLogs() {
        this.errorLog = [];
    }
    static exportLogs() {
        return JSON.stringify(this.errorLog, null, 2);
    }
    static getLastError() {
        return this.errorLog.length > 0
            ? this.errorLog[this.errorLog.length - 1]
            : null;
    }
}
ErrorHandler.isDevelopment = process.env.NODE_ENV === 'development';
ErrorHandler.errorLog = [];
ErrorHandler.maxLogSize = 100;
window.addEventListener('error', (event) => {
    ErrorHandler.handle(event.error, 'Uncaught Error');
});
window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.handle(event.reason, 'Unhandled Promise Rejection');
});
