import React from 'react';
import block from 'bem-cn-lite';

import './Breadcrumbs.scss';

const b = block('dc-breadcrumbs');

export interface BreadcrumbItem {
    name: string;
}

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
                {items.map(({name}, index, subItems) => (
                    <li key={index} className={b('item')}>
                        <span className={b('text')} aria-current={index === subItems.length - 1 ? 'page' : undefined}>
                            {name}
                        </span>
                    </li>
                ))}
            </ol>
        </nav>
    );
};
