function legacyCopy(text: string) {
    const textarea = document.createElement('textarea');

    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);
    textarea.select();

    try {
        return document.execCommand('copy');
    } finally {
        document.body.removeChild(textarea);
    }
}

export async function copyTextToClipboard(text: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(text);
            return;
        } catch {
            // the clipboard can be denied by permissions, try the legacy way below
        }
    }

    if (typeof document === 'undefined' || !legacyCopy(text)) {
        throw new Error('Copying to the clipboard is not supported');
    }
}
