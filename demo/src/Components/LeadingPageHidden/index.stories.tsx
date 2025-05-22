import React, {useEffect} from 'react';
import {DocLeadingPage, DocLeadingPageData, InterfaceProvider, Theme} from '@diplodoc/components';
import cn from 'bem-cn-lite';

import {updateBodyClassName} from '../utils';

import pageContent from './page.json';

const layoutBlock = cn('Layout');

type Args = {
    Mobile: string;
    Theme: Theme;
};

const DocLeadingPageHiddenDemo = (args: Args) => {
    const theme = args['Theme'];
    const router = {pathname: '/docs/compute'};
    const mobileView = Boolean(args['Mobile']);

    useEffect(() => {
        updateBodyClassName(theme);
    }, [theme]);

    return (
        <div className={mobileView ? 'mobile' : 'desktop'}>
            <div className={layoutBlock('content')}>
                <InterfaceProvider
                    interface={{
                        toc: false,
                        search: false,
                        feedback: false,
                    }}
                >
                    <DocLeadingPage
                        {...(pageContent as DocLeadingPageData)}
                        isMobile={mobileView}
                        wideFormat={true}
                        router={router}
                    />
                </InterfaceProvider>
            </div>
        </div>
    );
};

export default {
    title: 'Pages/LeadingHidden',
    component: DocLeadingPageHiddenDemo,
    argTypes: {
        Mobile: {
            control: 'boolean',
        },
        Theme: {
            control: 'select',
            options: Theme,
        },
    },
};

export const LeadingHidden = {
    args: {
        Mobile: false,
        Theme: Theme.Dark,
    },
};
