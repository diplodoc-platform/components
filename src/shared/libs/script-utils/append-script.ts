export interface AppendScriptOptions {
    url: string;
    element?: HTMLElement;
    defer?: boolean;
}

export async function appendScript(options: AppendScriptOptions) {
    const {url, defer = false, element = document.body} = options;

    return new Promise<Event>((resolve, reject) => {
        const script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = url;
        script.async = !defer;
        script.defer = defer;

        script.onload = resolve;
        script.onerror = reject;

        element.appendChild(script);
    });
}

const APPENDED_SCRIPTS: Record<string, Event> = {};

export async function appendScriptOnce(options: AppendScriptOptions) {
    const {url} = options;
    const loadedEvent = APPENDED_SCRIPTS[url];

    if (loadedEvent) {
        return Promise.resolve(loadedEvent);
    }

    const event = await appendScript(options);

    APPENDED_SCRIPTS[url] = event;

    return event;
}
