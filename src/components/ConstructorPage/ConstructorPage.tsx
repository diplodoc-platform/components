import React from 'react';

import {
    BackgroundMedia,
    Col,
    ConstructorBlocks,
    Grid,
    Row,
    getThemedValue,
} from '@gravity-ui/page-constructor';
import block from 'bem-cn-lite';

import {DEFAULT_SETTINGS} from '../../constants';
import {ConstructorPageData, DocumentType, Router, Theme} from '../../models';
import {DocLayout} from '../DocLayout';

const b = block('dc-doc-page');

const bPC = block('pc-page-constructor');
const bPCRow = block('pc-constructor-row');

const {wideFormat: defaultWideFormat} = DEFAULT_SETTINGS;

export interface ConstructorPageProps extends ConstructorPageData {
    router: Router;
    headerHeight?: number;
    wideFormat?: boolean;
    hideTocHeader?: boolean;
    hideToc?: boolean;
    tocTitleIcon?: React.ReactNode;
    theme: Theme;
    type: DocumentType;
}

export type WithChildren<T = {}> = T & {children?: React.ReactNode};

export const ConstructorRow = ({children}: WithChildren<{}>) =>
    children ? (
        <Row className={bPCRow()}>
            <Col>{children}</Col>
        </Row>
    ) : null;

export const ConstructorPage: React.FC<ConstructorPageProps> = ({
    data,
    toc,
    router,
    headerHeight,
    wideFormat = defaultWideFormat,
    hideTocHeader,
    hideToc,
    tocTitleIcon,
    footer,
    theme,
    type,
}) => {
    const modes = {
        'regular-page-width': !wideFormat,
    };

    const themedBackground = getThemedValue(data?.background, theme);

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
                    <main className={b('content')}>
                        {type === DocumentType.ConstructorPage && (
                            <div className={b('')}>
                                <div className={bPC('wrapper')}>
                                    {data?.blocks && themedBackground && (
                                        <BackgroundMedia
                                            {...themedBackground}
                                            className={bPC('background')}
                                        />
                                    )}
                                    <Grid>
                                        <ConstructorRow>
                                            <ConstructorBlocks items={data?.blocks} />
                                        </ConstructorRow>
                                    </Grid>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </DocLayout.Center>
        </DocLayout>
    );
};
