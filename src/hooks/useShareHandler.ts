import {useCallback, useMemo} from 'react';

export type ShareData = {
    title: string;
    url: string;
};

export const useShareHandler = (title: string) => {
    const {hostname, pathname} = router;

    const url: string = typeof window === 'undefined' ? '' : window.location.href;

    const shareData: ShareData = useMemo(() => {
        return {
            title,
            url,
        };
    }, [title, url]);

    const shareHandler = useCallback(() => {
        if (navigator && navigator.share) {
            navigator
                .share(shareData)
                .then(() => {})
                // eslint-disable-next-line no-console
                .catch((error) => console.error('Error sharing', error));
        } else {
            // eslint-disable-next-line no-console
            console.log('Share not supported', shareData);
        }
    }, [shareData]);

    return shareHandler;
};
