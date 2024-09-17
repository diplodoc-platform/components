import {useCallback, useMemo} from 'react';

import {Router} from '../models';

export type ShareData = {
    title: string;
    url: string;
};

export const useShareHandler = (title: string, router: Router) => {
    const {hostname, pathname} = router;

    const url: string = useMemo(() => {
        if (hostname) {
            return `${hostname}/${pathname}`;
        }

        return window.location.href;
    }, [hostname, pathname]);

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
