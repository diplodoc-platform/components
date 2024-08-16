import React from 'react';
import block from 'bem-cn-lite';

import {DEFAULT_SETTINGS} from '../../constants';
import {DocContentPageData, Router} from '../../models';
import {DocLayout} from '../DocLayout';

const b = block('dc-doc-page');

const {wideFormat: defaultWideFormat} = DEFAULT_SETTINGS;

export interface DocContentPageProps extends DocContentPageData {
    router: Router;
    headerHeight?: number;
    wideFormat?: boolean;
    hideTocHeader?: boolean;
    hideToc?: boolean;
    tocTitleIcon?: React.ReactNode;
}

export const DocContentPage: React.FC<DocContentPageProps> = ({
    data,
    toc,
    router,
    headerHeight,
    wideFormat = defaultWideFormat,
    hideTocHeader,
    hideToc,
    tocTitleIcon,
    footer,
    children,
}) => {
    const modes = {
        'regular-page-width': !wideFormat,
    };

    return (
        <DocLayout
            toc={toc}
            router={router}
            headerHeight={headerHeight}
            className={b(modes)}
            hideTocHeader={hideTocHeader}
            hideToc={hideToc || data?.fullScreen}
            fullScreen={data?.fullScreen}
            tocTitleIcon={tocTitleIcon}
            footer={footer}
            hideRight={true}
            wideFormat={wideFormat}
        >
            <DocLayout.Center>
                <div className={b('main')}>
                    <main className={b('content')}>{children}</main>
                </div>
            </DocLayout.Center>
        </DocLayout>
    );
};
