import React, {useEffect} from 'react';

import {
    ConstructorPage as ConstructorPageComponent,
    ConstructorPageData,
    DocumentType,
} from '@diplodoc/components';
import {PageConstructor, PageConstructorProvider} from '@gravity-ui/page-constructor';
import {ThemeProvider} from '@gravity-ui/uikit';
import cn from 'bem-cn-lite';

import {updateBodyClassName} from '../utils';

import pageContent from './page.json';

import './index.scss';

const layoutBlock = cn('Layout');

const ConstructorPageDemo = (args) => {
    const isMobile = args['Mobile'];
    const theme = args['Theme'];
    const router = {pathname: '/docs/compute'};

    useEffect(() => {
        updateBodyClassName(theme);
    }, [theme]);

    const Page = () => {
        return (
            <div className={isMobile === 'true' ? 'mobile' : 'desktop'}>
                <div className={layoutBlock('content')}>
                    <ConstructorPageComponent
                        {...(pageContent as ConstructorPageData)}
                        wideFormat={true}
                        router={router}
                        type={DocumentType.ConstructorPage}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <PageConstructorProvider theme={theme}>
                    <PageConstructor
                        custom={{
                            blocks: {
                                page: () => <Page />,
                            },
                        }}
                        content={{
                            blocks: [
                                {
                                    type: 'page',
                                },
                            ],
                        }}
                    />
                </PageConstructorProvider>
            </ThemeProvider>
        </div>
    );
};

export default {
    title: 'Pages/Constructor',
    component: ConstructorPageDemo,
};

export const Constructor = {
    args: {},
};
