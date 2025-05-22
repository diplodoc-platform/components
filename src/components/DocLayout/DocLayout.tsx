import React, {PropsWithChildren, ReactElement} from 'react';
import block from 'bem-cn-lite';

import {Router, TocData} from '../../models';
import {getStateKey} from '../../utils';
import {Toc} from '../Toc';
import {useInterface} from '../../hooks/useInterface';

import './DocLayout.scss';

const b = block('dc-doc-layout');

const Left: React.FC<PropsWithChildren> = () => null;
const Center: React.FC<PropsWithChildren> = () => null;
const Right: React.FC<PropsWithChildren> = () => null;

export interface DocLayoutProps {
    toc: TocData;
    router: Router;
    children: (ReactElement | null)[] | ReactElement<unknown, React.FC>;
    fullScreen?: boolean;
    hideRight?: boolean;
    wideFormat?: boolean;
    headerHeight?: number;
    tocTitleIcon?: React.ReactNode;
    hideTocHeader?: boolean;
    hideToc?: boolean;
    className?: string;
    loading?: boolean;
    footer?: React.ReactNode;
    singlePage?: boolean;
    legacyToc?: boolean;
    onChangeSinglePage?: (value: boolean) => void;
    pdfLink?: string;
}

type DocLayoutStatic = {
    Left: React.FC<PropsWithChildren>;
    Center: React.FC<PropsWithChildren>;
    Right: React.FC<PropsWithChildren>;
};

export const DocLayout: React.FC<DocLayoutProps> & DocLayoutStatic = ({
    children,
    className,
    fullScreen = false,
    wideFormat = false,
    hideRight = false,
    loading = false,
    footer = null,
    legacyToc = false,
    toc,
    router,
    headerHeight,
    tocTitleIcon,
    hideTocHeader,
    hideToc,
    singlePage,
    onChangeSinglePage,
    pdfLink,
}) => {
    const isTocHidden = useInterface('toc');

    let left, center, right;
    const modes = {
        'regular-page-width': !wideFormat,
        'full-screen': fullScreen,
        'hidden-right': hideRight,
        loading: loading,
    };

    React.Children.forEach(children, (child) => {
        if (!child) {
            return;
        }

        switch (child.type) {
            case Left:
                left = child.props.children;
                break;
            case Center:
                center = child.props.children;
                break;
            case Right:
                right = child.props.children;
                break;
        }
    });

    return (
        <div className={b(null, className)}>
            <div className={b('mobile-only')}>{footer}</div>
            {fullScreen
                ? null
                : !isTocHidden && (
                      <div className={b('left', modes, legacyToc ? b('legacy-toc') : undefined)}>
                          {toc && !hideToc && (
                              <div className={b('toc')}>
                                  <Toc
                                      key={getStateKey(hideRight, wideFormat, toc.singlePage)}
                                      {...toc}
                                      router={router}
                                      headerHeight={headerHeight}
                                      tocTitleIcon={tocTitleIcon}
                                      hideTocHeader={hideTocHeader}
                                      singlePage={singlePage}
                                      onChangeSinglePage={onChangeSinglePage}
                                      pdfLink={pdfLink}
                                  />
                              </div>
                          )}
                          {left}
                      </div>
                  )}
            {fullScreen || hideRight ? null : <div className={b('right', modes)}>{right}</div>}
            <div className={b('center', modes)}>
                {center}
                <div className={b('desktop-only')}>{footer}</div>
            </div>
        </div>
    );
};

DocLayout.Left = Left;
DocLayout.Center = Center;
DocLayout.Right = Right;
