import block from 'bem-cn-lite';
import React from 'react';

import {BreadcrumbItem} from '../../models';

import './Breadcrumbs.scss';

const b = block('dc-breadcrumbs');

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({items, className}) => {
    if (!items || !items.length) {
        return null;
    }

    return (
        <nav className={b(null, className)} aria-label="Breadcrumbs">
            <ol className={b('items')}>
                {items.map(({name, url}, index, subItems) => (
                    <li key={index} className={b('item')}>
                        {renderItem({name, url}, index === subItems.length - 1)}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

function renderItem({name, url}: BreadcrumbItem, isLast: boolean) {
    const hasUrl = Boolean(url);

    return React.createElement(
        hasUrl && !isLast ? 'a' : 'span',
        {
            className: b('text', {link: hasUrl}),
            href: url,
            ['aria-current']: isLast ? 'page' : null,
        },
        name,
    );
}
