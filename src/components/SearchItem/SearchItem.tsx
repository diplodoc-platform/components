import React from 'react';
import block from 'bem-cn-lite';
import {HTML} from '../HTML';

import './SearchItem.scss';

const b = block('SearchItem');

export interface ISearchItem {
    url: string;
    title: string;
    description?: string;
    highlights?: SearchHighlights;
}

export interface SearchHighlights {
    title: string;
    content: string;
    description: string;
}

export interface SearchItemProps {
    item: ISearchItem;
    className?: string;
    onClick?: () => void;
}

const SearchItem = ({item, className, onClick}: SearchItemProps) => {
    const {url, title, description, highlights} = item;

    /**
     * Get first existing highlight and remove trailing punctuation marks
     * (there will be the '...' in the end)
     */

    const getHighlight = () => {
        return (
            (highlights && highlights.content) ||
            (highlights && highlights.description) ||
            description ||
            ''
        ).replace(/[.,!?:;]$/g, '');
    };

    return (
        <div className={b(null, className)}>
            <a className={b('link')} href={url} onClick={onClick}>
                <h4 className={b('title')}>
                    <HTML>{title}</HTML>
                </h4>
                <HTML className={b('description')} block>
                    {getHighlight()}
                </HTML>
            </a>
        </div>
    );
};

export default SearchItem;
