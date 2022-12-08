import React, {ReactNode} from 'react';
import block from 'bem-cn-lite';

import {Button, Icon} from '@gravity-ui/uikit';

import arrowIcon from '../../../assets/icons/arrow-right.svg';

import './Paginator.scss';

const b = block('Paginator');

const MOBILE_VISIBLE_PAGES = 1;
const DESKTOP_VISIBLE_PAGES = 3;
const MAX_VISIBLE_PAGES = 6;

export interface ClassNameProps {
    className?: string;
}

interface PaginatorDefaultProps {
    page: number;
    totalItems: number;
    itemsPerPage?: number;
    maxPages?: number;
}

export interface PaginatorProps extends Partial<PaginatorDefaultProps>, ClassNameProps {
    onPageChange: (page: number) => void;
    isMobile?: boolean;
}

type PaginatorInnerProps = PaginatorProps & PaginatorDefaultProps;

interface Modifications {
    [name: string]: string | boolean | undefined;
}

interface PaginatorItemProps<T> {
    key: T;
    mods: Modifications;
    content: ReactNode;
    onClick?: (key: T) => void;
}

enum ArrowType {
    Prev = 'prev',
    Next = 'next',
}

const Paginator = ({
    page = 1,
    totalItems = 0,
    itemsPerPage = 10,
    maxPages = Infinity,
    className,
    isMobile = false,
    onPageChange,
}: PaginatorInnerProps) => {
    const getPagesCount = () => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        return Math.min(totalPages, maxPages);
    };

    const pagesCount = getPagesCount();

    if (pagesCount <= 1) {
        return null;
    }

    const renderPaginatorItem = <T,>({key, mods, content, onClick}: PaginatorItemProps<T>) => {
        return (
            <li
                key={`page_${key}`}
                className={b('item', mods)}
                onClick={onClick && onClick.bind(this, key)}
            >
                {content}
            </li>
        );
    };

    const handlePageChange = (newPage: number) => {
        if (onPageChange) {
            onPageChange(newPage);
        }
    };

    const handleArrowClick = (type: string) => {
        let newPage = page;
        if (type === 'prev' && page > 1) {
            newPage = page - 1;
        } else if (type === 'next' && page < pagesCount) {
            newPage = page + 1;
        }
        if (newPage !== page) {
            handlePageChange(newPage);
        }
    };

    const handlePageClick = (index: number) => {
        if (index !== page) {
            handlePageChange(index);
        }
    };

    const getPageConfigs = () => {
        const visiblePages = isMobile ? MOBILE_VISIBLE_PAGES : DESKTOP_VISIBLE_PAGES;

        const pages = [];

        for (let i = 1; i <= pagesCount; i++) {
            if (
                pagesCount <= MAX_VISIBLE_PAGES ||
                i <= visiblePages ||
                i > pagesCount - visiblePages ||
                (i >= page - 1 && i <= page + 1)
            ) {
                pages.push({
                    key: i,
                    mods: {type: 'page', active: page === i},
                    onClick: handlePageClick,
                    content: i,
                });
            } else if (pages.length > 0 && pages[pages.length - 1].key !== 'dots') {
                pages.push({
                    key: 'dots',
                    mods: {type: 'dots'},
                    content: '...',
                });
            }
        }

        return pages;
    };

    const arrowButton = (disable: boolean) => (
        <Button className={b('icon')} size="s" view={'flat'} disabled={disable}>
            <Icon data={arrowIcon} size={16} />
        </Button>
    );

    const pages = getPageConfigs() as PaginatorItemProps<string>[];

    pages.unshift({
        key: ArrowType.Prev,
        mods: {type: 'prev'},
        onClick: handleArrowClick,
        content: arrowButton(page === 1),
    });

    pages.push({
        key: ArrowType.Next,
        mods: {type: 'next'},
        onClick: handleArrowClick,
        content: arrowButton(page === pagesCount),
    });

    return <ul className={b(null, className)}>{pages.map(renderPaginatorItem)}</ul>;
};

export default Paginator;
