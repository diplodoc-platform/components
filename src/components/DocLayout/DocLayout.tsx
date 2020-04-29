import React, {ReactElement} from 'react';
import block from 'bem-cn-lite';

import {TocData, Router, Lang} from '../../models';
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
    children: ReactElement[] | ReactElement<unknown, React.FC>;
    className?: string;
}

export class DocLayout extends React.Component<DocLayoutProps> {

    static Left = Left;
    static Center = Center;
    static Right = Right;

    render() {
        const {children, className} = this.props;
        let left, center, right;

        React.Children.forEach(children, (child) => {
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
                <div className={b('left')}>
                    {this.renderToc()}
                    {left}
                </div>
                <div className={b('center')}>{center}</div>
                <div className={b('right')}>{right}</div>
            </div>
        );
    }

    private renderToc() {
        const {toc, router, lang} = this.props;

        if (!toc) {
            return null;
        }

        return (
            <div className={b('toc')}>
                <Toc {...toc} router={router} lang={lang}/>
            </div>
        );
    }
}
