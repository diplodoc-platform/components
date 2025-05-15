import React, {memo, useState} from 'react';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {useTranslation} from '../../hooks';
import {HTML} from '../HTML';

import './SearchItem.scss';

const b = block('SearchItem');

export interface ISearchItem {
    url: string;
    title: string;
    description?: string;
    objectID?: string; // Algolia
}

export interface SearchOnClickProps {
    itemOnClick?: (item: ISearchItem) => void;
    irrelevantOnClick?: (item: ISearchItem) => void;
    relevantOnClick?: (item: ISearchItem) => void;
}

export interface SearchItemProps {
    item: ISearchItem;
    className?: string;
}

type SearchPageInnerProps = SearchItemProps & SearchOnClickProps;

const SearchItem = memo<SearchPageInnerProps>(
    ({item, className, itemOnClick, irrelevantOnClick, relevantOnClick}) => {
        const {t} = useTranslation('search');
        const {url, title, description} = item;

        const [markedItem, setMarkedItem] = useState(false);

        const renderItem = () => {
            return (
                <div className={b('item-wrapper')}>
                    <a
                        className={b('item')}
                        href={url}
                        onClick={() => (itemOnClick ? itemOnClick(item) : undefined)}
                    >
                        <HTML className={b('item-title')}>{title}</HTML>
                        <HTML className={b('item-description')}>{description}</HTML>
                    </a>
                    {irrelevantOnClick && relevantOnClick && (
                        <div className={b('marks')}>
                            <div className={b('marks-wrapper')}>
                                {markedItem ? (
                                    <span className={b('marks-text')}>
                                        {t('search_mark-result-text')}
                                    </span>
                                ) : (
                                    <div>
                                        <Button
                                            size="s"
                                            className={b('mark')}
                                            onClick={() => {
                                                setMarkedItem(true);
                                                if (irrelevantOnClick) {
                                                    irrelevantOnClick(item);
                                                }
                                            }}
                                        >
                                            {t('search_mark_dislike')}
                                        </Button>
                                        <Button
                                            size="s"
                                            className={b('mark')}
                                            onClick={() => {
                                                setMarkedItem(true);
                                                if (relevantOnClick) {
                                                    relevantOnClick(item);
                                                }
                                            }}
                                        >
                                            {t('search_mark_like')}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            );
        };

        return <div className={b(null, className)}>{renderItem()}</div>;
    },
);

SearchItem.displayName = 'SearchItem';

export default SearchItem;
