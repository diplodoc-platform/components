import React, {useEffect} from 'react';
import {DocLeadingPage, DocLeadingPageData, Theme} from '@diplodoc/components';
import cn from 'bem-cn-lite';

import {updateBodyClassName, useMobile} from '../utils';

import pageContent from './page.json';

const layoutBlock = cn('Layout');

type Args = {
    Mobile: string;
    Theme: Theme;
};

const DocLeadingPageDemo = (args: Args) => {
    const theme = args['Theme'];
    const router = {pathname: '/docs/compute'};
    const mobileView = useMobile();

    useEffect(() => {
        updateBodyClassName(theme);
    }, [theme]);

    return (
        <div className={isMobile === 'true' ? 'mobile' : 'desktop'}>
            <div className={layoutBlock('content')}>
                <DocLeadingPage
                    {...(pageContent as DocLeadingPageData)}
                    isMobile={mobileView}
                    wideFormat={true}
                    router={router}
                />
            </div>
        </div>
    );
};

export default {
    title: 'Pages/Leading',
    component: DocLeadingPageDemo,
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

export const Leading = {
    args: {
        Mobile: false,
        Theme: Theme.Dark,
    },
};
