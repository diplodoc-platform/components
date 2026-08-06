import type {PropsWithChildren, ReactElement} from 'react';
import type {Router, TocData} from '../../models';

import React from 'react';
import block from 'bem-cn-lite';

import {getStateKey} from '../../utils';
import {useTranslation} from '../../hooks';
import {Toc} from '../Toc';
import {useInterface} from '../../hooks/useInterface';

import './DocLayout.scss';

const b = block('dc-doc-layout');

type DocLayoutReactElement = ReactElement<PropsWithChildren, React.FC>;

const Left: React.FC<PropsWithChildren> = () => null;
const Center: React.FC<PropsWithChildren> = () => null;
const Right: React.FC<PropsWithChildren> = () => null;

export interface DocLayoutProps {
    toc: TocData;
    router: Router;
    children: (DocLayoutReactElement | null)[] | DocLayoutReactElement;
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
    tocCollapsed?: boolean;
    onChangeTocCollapsed?: (value: boolean) => void;
    onChangeSinglePage?: (value: boolean) => void;
    pdfLink?: string;
    pdfIconConfig?: {position?: string; size?: 'S' | 'M' | 'L'; icon?: string};
}

type DocLayoutStatic = {
    Left: React.FC<PropsWithChildren>;
    Center: React.FC<PropsWithChildren>;
    Right: React.FC<PropsWithChildren>;
};

interface TocCollapseButtonProps {
    collapsed: boolean;
    controls: string;
    onChange: (value: boolean) => void;
}

const TocCollapseButton: React.FC<TocCollapseButtonProps> = ({collapsed, controls, onChange}) => {
    const {t} = useTranslation('controls');
    const title = collapsed ? t('expand-toc-text') : t('collapse-toc-text');

    return (
        <button
            type="button"
            className={b('toc-collapse-button', {collapsed})}
            title={title}
            aria-label={title}
            aria-controls={controls}
            aria-expanded={!collapsed}
            onClick={() => onChange(!collapsed)}
        >
            <svg
                className={b('toc-collapse-button-icon')}
                width="16"
                height="10"
                viewBox="0 0 8 8"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="m.72 7.64 6.39-3.2a.5.5 0 0 0 0-.89L.72.36A.5.5 0 0 0 0 .81v6.38c0 .37.4.61.72.45Z" />
            </svg>
        </button>
    );
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
    tocCollapsed = false,
    toc,
    router,
    headerHeight,
    tocTitleIcon,
    hideToc,
    onChangeTocCollapsed,
    singlePage,
    onChangeSinglePage,
    pdfLink,
    pdfIconConfig,
    hideTocHeader,
}) => {
    const isTocHidden = useInterface('toc');
    const isTocHeaderHidden = useInterface('toc-header');
    const tocId = React.useId();
    const tocCollapsible = Boolean(toc && !hideToc && !legacyToc && onChangeTocCollapsed);
    const isTocCollapsed = tocCollapsible && tocCollapsed;

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
                      <div
                          className={b(
                              'left',
                              {...modes, 'toc-collapsed': isTocCollapsed},
                              legacyToc ? b('legacy-toc') : undefined,
                          )}
                      >
                          {toc && !hideToc && (
                              <div
                                  className={b('toc', {
                                      collapsible: tocCollapsible,
                                      'toc-collapsed': isTocCollapsed,
                                  })}
                              >
                                  <Toc
                                      key={getStateKey(hideRight, wideFormat, toc.singlePage)}
                                      {...toc}
                                      id={tocId}
                                      router={router}
                                      headerHeight={headerHeight}
                                      tocTitleIcon={tocTitleIcon}
                                      hideTocHeader={hideTocHeader || isTocHeaderHidden}
                                      singlePage={singlePage}
                                      onChangeSinglePage={onChangeSinglePage}
                                      pdfLink={pdfLink}
                                      pdfIconConfig={pdfIconConfig}
                                  />
                                  {tocCollapsible && onChangeTocCollapsed && (
                                      <TocCollapseButton
                                          collapsed={isTocCollapsed}
                                          controls={tocId}
                                          onChange={onChangeTocCollapsed}
                                      />
                                  )}
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
