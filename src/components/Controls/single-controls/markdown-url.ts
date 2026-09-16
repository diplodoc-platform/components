export type MarkdownAction = 'copy' | 'view';

const COPY_ACTION_QUERY_PARAM = '__mdAction';

export function setMarkdownAction(url: URL, action: MarkdownAction) {
    url.hash = '';

    if (action === 'copy') {
        url.searchParams.set(COPY_ACTION_QUERY_PARAM, action);
    } else {
        url.searchParams.delete(COPY_ACTION_QUERY_PARAM);
    }

    return url.toString();
}

export function getMarkdownUrl(currentUrl: string, action: MarkdownAction = 'view') {
    const markdownUrl = new URL(currentUrl);

    if (markdownUrl.pathname.endsWith('/')) {
        markdownUrl.pathname += 'index.md';
    } else {
        markdownUrl.pathname = markdownUrl.pathname.replace(/\.(?:html?|md)$/i, '') + '.md';
    }

    return setMarkdownAction(markdownUrl, action);
}
