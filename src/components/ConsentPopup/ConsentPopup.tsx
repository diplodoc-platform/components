import type {AnalyticsParams} from '../../hooks';

import React from 'react';
import {ConsentManager, ConsentMode, CookieConsent} from '@gravity-ui/components';

import {useAnalytics} from '../../hooks';

const ConsentPopup: React.FC<AnalyticsParams> = (props) => {
    const consentManager = React.useMemo(
        () =>
            new ConsentManager(
                props.consentMode === 'notification' ? ConsentMode.Notification : ConsentMode.Base,
            ),
        [props.consentMode],
    );
    const [useConsent, setUseConsent] = React.useState(
        Boolean(consentManager?.getConsents().analytics),
    );

    const onConsentPopupClose = React.useCallback(() => {
        setUseConsent(Boolean(consentManager?.getConsents().analytics));
    }, [consentManager]);

    useAnalytics({
        gtmId: props.gtmId,
        router: props.router,
        useConsent,
    });

    if (!consentManager) {
        return null;
    }

    return (
        <CookieConsent consentManager={consentManager} onConsentPopupClose={onConsentPopupClose} />
    );
};

export default ConsentPopup;
