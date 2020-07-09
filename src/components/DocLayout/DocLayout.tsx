import React, {ReactElement} from 'react';
import block from 'bem-cn-lite';

import {TocData, Router, Lang} from '../../models';
import {getStateKey} from '../../utils';
import {Toc} from '../Toc';
import {TocNavPanel} from '../TocNavPanel';

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
    limitTextWidth?: boolean;
    headerHeight?: number;
    tocTitleIcon?: React.ReactNode;
    className?: string;
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
            limitTextWidth = false,
            hideRight = false,
        } = this.props;
        let left, center, right;
        const modes = {
            'limit-width': limitTextWidth,
            'full-screen': fullScreen,
            'hidden-right': hideRight,
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
                    {this.renderTocNavPanel()}
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
        const {toc, router, headerHeight, tocTitleIcon, hideRight, limitTextWidth} = this.props;

        if (!toc) {
            return null;
        }

        return (
            <div className={b('toc')}>
                <Toc
                    /* This key allows recalculating the offset for the toc for Safari */
                    key={getStateKey(hideRight, limitTextWidth)}
                    {...toc}
                    router={router}
                    headerHeight={headerHeight}
                    tocTitleIcon={tocTitleIcon}
                />
            </div>
        );
    }

    private renderTocNavPanel() {
        const {toc, router, fullScreen} = this.props;

        if (!toc || !fullScreen) {
            return null;
        }

        return <TocNavPanel {...toc} router={router}/>;
    }
}
