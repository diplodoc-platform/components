import {useCallback, useMemo} from 'react';

import {copyTextToClipboard} from '../utils/clipboard';

export type ShareData = {
    title: string;
    url: string;
};

export type ShareResult =
    /** the link was passed to the system share sheet */
    | 'shared'
    /** the user closed the share sheet */
    | 'dismissed'
    /** the Web Share API is unavailable, the link was copied to the clipboard instead */
    | 'copied'
    /** neither sharing nor copying worked */
    | 'failed';

function isAbortError(error: unknown) {
    return error instanceof Error && error.name === 'AbortError';
}

export const useShareHandler = (title: string) => {
    const url: string = typeof window === 'undefined' ? '' : window.location.href;

    const shareData: ShareData = useMemo(() => {
        return {
            title,
            url,
        };
    }, [title, url]);

    const shareHandler = useCallback(async (): Promise<ShareResult> => {
        // Android WebView has no Web Share API, so the link is copied to the clipboard instead
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share(shareData);

                return 'shared';
            } catch (error) {
                if (isAbortError(error)) {
                    return 'dismissed';
                }
            }
        }

        try {
            await copyTextToClipboard(url);

            return 'copied';
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error sharing', error);

            return 'failed';
        }
    }, [shareData, url]);

    return shareHandler;
};
