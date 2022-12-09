import React, {useState} from 'react';
import block from 'bem-cn-lite';
import {Button} from '@gravity-ui/uikit';

import './SearchItem.scss';
import {WithTranslation, withTranslation, WithTranslationProps} from 'react-i18next';
import {Lang} from '../../models';

const b = block('SearchItem');

export interface ISearchItem {
    url: string;
    title: string;
    description?: string;
    highlights?: SearchHighlights;
}

export interface SearchHighlights {
    title?: string;
    content: string;
    description: string;
}

export interface SearchOnClickProps {
    itemOnClick?: (item: ISearchItem) => void;
    irrelevantOnClick?: (item: ISearchItem) => void;
    relevantOnClick?: (item: ISearchItem) => void;
}

export interface SearchItemProps {
    item: ISearchItem;
    className?: string;
    lang?: Lang;
}

type SearchPageInnerProps = SearchItemProps &
    SearchOnClickProps &
    WithTranslation &
    WithTranslationProps;

const SearchItem = ({
    item,
    className,
    lang = Lang.En,
    i18n,
    t,
    itemOnClick,
    irrelevantOnClick,
    relevantOnClick,
}: SearchPageInnerProps) => {
    const {url, title, description, highlights} = item;

    if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
    }

    const [markedItem, setMarkedItem] = useState(false);
    /**
     * Get first existing highlight and remove trailing punctuation marks
     * (there will be the '...' in the end)
     */

    const getDescription = () => {
        return (
            (highlights && highlights.content) ||
            (highlights && highlights.description) ||
            description ||
            ''
        ).replace(/[.,!?:;]$/g, '');
    };

    const renderItem = () => {
        return (
            <div className={b('item-wrapper')} key={title}>
                <a
                    className={b('item')}
                    href={url}
                    onClick={() => (itemOnClick ? itemOnClick(item) : undefined)}
                >
                    <span className={b('item-title')}>{title}</span>
                    <span className={b('item-description')}>{getDescription()}</span>
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
};

export default withTranslation('search')(SearchItem);
