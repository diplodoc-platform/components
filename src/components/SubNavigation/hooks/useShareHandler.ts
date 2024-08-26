import {useCallback, useMemo} from 'react';

import {Router} from 'src/models';

type ShareData = {
    title: string;
    url: string;
};

const useShareHandler = (title: string, router: Router) => {
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
                .catch((error) => console.error('Error sharing', error));
        } else {
            console.log('Share not supported', shareData);
        }
    }, [shareData]);

    return shareHandler;
};

export default useShareHandler;
