export function FormError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <p
            aria-live="polite"
            className="text-[13px] text-destructive -mt-2.5 mb-4.5"
        >
            {message}
        </p>
    );
}
