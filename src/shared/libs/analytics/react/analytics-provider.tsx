import {createContext, useContext} from 'react';

import {Analytics} from '../analytics';

const nullAnalytics = new Analytics({debug: false, adapters: []});

const AnalyticsContext = createContext<Analytics>(nullAnalytics);

export const AnalyticsProvider = AnalyticsContext.Provider;

export function useAnalytics() {
    const analytics = useContext(AnalyticsContext);

    return analytics;
}
