interface Turnstile {
    reset(widgetId?: string): void;

    render(
        container: string | HTMLElement,
        options: {
            sitekey: string;
            callback?: (token: string) => void;
            "error-callback"?: () => void;
            "expired-callback"?: () => void;
        }
    ): string;

    remove(widgetId: string): void;
}

interface Window {
    turnstile: Turnstile;
}