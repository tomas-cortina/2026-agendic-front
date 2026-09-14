export class InputParseError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

// The back's own validation rejected input the front let through; InputParseError stays for local Zod failures.
export class BackendValidationError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export class NotFoundError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}
