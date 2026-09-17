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

export function resolveMarkdownActionUrl(
    sourceUrl: string,
    baseUrl: string,
    action: MarkdownAction,
) {
    const markdownUrl = new URL(sourceUrl, baseUrl);
    const resolvedUrl = setMarkdownAction(markdownUrl, action);

    if (/^[a-z][a-z\d+.-]*:/iu.test(sourceUrl)) {
        return resolvedUrl;
    }

    const [relativePath] = sourceUrl.split(/[?#]/u, 1);

    return `${relativePath}${markdownUrl.search}`;
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
