import React, {ReactElement} from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import {DocHeadingItem, Router, Lang} from '../../models';
import {Scrollspy} from '../Scrollspy';

import './MiniToc.scss';

const b = block('dc-mini-toc');

export interface MinitocProps {
    lang: Lang;
    headings: DocHeadingItem[];
    router: Router;
    headerHeight?: number;
}

type MinitocInnerProps = MinitocProps & WithTranslation & WithTranslationProps;

class MiniToc extends React.Component<MinitocInnerProps> {
    static propTypes = {
        headings: PropTypes.array.isRequired,
    };

    componentDidUpdate(prevProps: MinitocProps) {
        const {i18n, lang} = this.props;
        if (prevProps.lang !== lang) {
            i18n.changeLanguage(lang);
        }
    }

    render() {
        const {lang, i18n, t} = this.props;

        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }

        return (
            <div className={b()}>
                <div className={b('title')}>{t('title')}:</div>
                {this.renderSections()}
            </div>
        );
    }

    private renderSections() {
        const {headings, router, headerHeight} = this.props;

        if (headings.length === 0) {
            return null;
        }

        const sectionHrefs = headings.reduce<string[]>((prevHrefs, {href, items}) => {
            const children = items ? items.map(({href: itemHref}) => itemHref) : [];

            return prevHrefs.concat(href, children);
        }, []);

        if (sectionHrefs.length === 0) {
            return null;
        }

        return (
            <Scrollspy
                className={b('sections')}
                currentClassName={b('section', {active: true})}
                items={sectionHrefs}
                router={router}
                headerHeight={headerHeight}
            >
                {headings.reduce(this.renderSection, [])}
            </Scrollspy>
        );
    }

    private renderSection = (prevSections: ReactElement[], heading: DocHeadingItem) => {
        return prevSections.concat(
            this.renderItem(heading),
            heading.items ? heading.items.map((item) => this.renderItem(item, true)) : [],
        );
    };

    private renderItem = ({title, href}: DocHeadingItem, isChild = false) => {
        return (
            <li key={href} data-hash={href} className={b('section', {child: isChild})}>
                <a href={href} className={b('section-link')} data-router-shallow>
                    {title}
                </a>
            </li>
        );
    };
}

export default withTranslation('mini-toc')(MiniToc);
