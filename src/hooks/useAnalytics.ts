import type {Router} from '../models';

import React from 'react';
import TagManager from 'react-gtm-module';

type GtagEventFunction = (
    data: {
        type?: string;
        event?: string;
        action?: string;
        params?: Record<string, string | number | undefined>;
    },
    force?: boolean,
) => void;

// There used to be a `declare global { interface Window { gtag: ... } }` here.
// It was removed: this package never read `window.gtag` (analytics goes through
// TagManager.dataLayer), and the type did not match the real gtag.js, whose
// signature is (command, targetId, params). The global declaration overrode the
// type of a browser API for every consumer of this package and broke correct
// calls such as `window.gtag('config', id, {...})`.

export type AnalyticsParams = {
    gtmId: string;
    router: Router;
    useConsent?: boolean;
    consentMode?: 'base' | 'notification';
};

export const useAnalytics = ({gtmId, router, useConsent}: AnalyticsParams) => {
    const [gtmInitialized, setGtmInitialized] = React.useState(false);

    const sendEvent = React.useCallback<GtagEventFunction>(
        (data, force) => {
            if (!useConsent && !force) {
                return;
            }
            TagManager.dataLayer({dataLayer: data});
        },
        [useConsent],
    );

    React.useEffect(() => {
        if (!gtmId) {
            return;
        }
        if (!gtmInitialized) {
            TagManager.initialize({
                gtmId,
                dataLayer: [],
            });
            setGtmInitialized(true);
        }
        sendEvent(
            {
                type: 'consent',
                action: 'default',
                params: {
                    analytics_storage: useConsent ? 'granted' : 'denied',
                    wait_for_update: useConsent ? 0 : Infinity,
                },
            },
            true,
        );
        sendEvent(
            {
                event: 'default_consent',
            },
            true,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gtmId, sendEvent]);

    React.useEffect(() => {
        if (!gtmInitialized) {
            return;
        }
        sendEvent(
            {
                type: 'consent',
                action: 'update',
                params: {
                    analytics_storage: useConsent ? 'granted' : 'denied',
                },
            },
            true,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [useConsent]);

    React.useEffect(() => {
        if (!gtmInitialized) {
            return;
        }
        sendEvent({
            type: 'config',
            action: gtmId,
            params: {
                page_path: router.pathname,
            },
        });
    }, [gtmInitialized, sendEvent, gtmId, router.pathname]);

    return {
        sendEvent,
    };
};
