export class AuthenticationError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export class EmailTakenError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export class UnauthenticatedError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export class VerificationLinkExpiredError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

// Invalid, already used and tampered-with share this one: the Usuario reads the same message for all three.
export class VerificationLinkInvalidError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}
