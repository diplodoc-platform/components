import React, {ReactElement} from 'react';
import block from 'bem-cn-lite';

import {TocData, Router, Lang} from '../../models';
import {getStateKey} from '../../utils';
import {Toc} from '../Toc';

import './DocLayout.scss';

const b = block('dc-doc-layout');

const Left: React.FC = () => null;
const Center: React.FC = () => null;
const Right: React.FC = () => null;

export interface DocLayoutProps {
    toc: TocData;
    router: Router;
    lang: Lang;
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
}

export class DocLayout extends React.Component<DocLayoutProps> {

    static Left = Left;
    static Center = Center;
    static Right = Right;

    render() {
        const {
            children,
            className,
            fullScreen = false,
            wideFormat = false,
            hideRight = false,
            loading = false,
        } = this.props;
        let left, center, right;
        const modes = {
            'regular-page-width': !wideFormat,
            'full-screen': fullScreen,
            'hidden-right': hideRight,
            'loading': loading,
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
                {fullScreen ? null :
                    <div className={b('left', modes)}>
                        {this.renderToc()}
                        {left}
                    </div>
                }
                <div className={b('center', modes)}>
                    {center}
                </div>
                {fullScreen || hideRight ? null :
                    <div className={b('right', modes)}>
                        {right}
                    </div>
                }
            </div>
        );
    }

    private renderToc() {
        const {toc, router, headerHeight, tocTitleIcon, hideRight, wideFormat, hideTocHeader, hideToc} = this.props;

        if (!toc || hideToc) {
            return null;
        }

        return (
            <div className={b('toc')}>
                <Toc
                    /* This key allows recalculating the offset for the toc for Safari */
                    key={getStateKey(hideRight, wideFormat, toc.singlePage)}
                    {...toc}
                    router={router}
                    headerHeight={headerHeight}
                    tocTitleIcon={tocTitleIcon}
                    hideTocHeader={hideTocHeader}
                />
            </div>
        );
    }
}
