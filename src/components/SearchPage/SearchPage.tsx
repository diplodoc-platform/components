import React, {useRef} from 'react';
import block from 'bem-cn-lite';
import {TextInput, Button} from '@gravity-ui/uikit';
import {TFunction, withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import {Paginator, PaginatorProps} from '../Paginator';
import {ISearchItem, SearchItem, SearchOnClickProps} from '../SearchItem';
import {Lang} from '../../models';

import './SearchPage.scss';

const b = block('dv-search-page');

interface Translation {
    t: TFunction<'translation'>;
}

interface InputProps {
    query: string;
    onSubmit: () => void;
    onQueryUpdate: (arg: string) => void;
}

type RenderInput = {
    inputRef: React.MutableRefObject<null>;
} & InputProps &
    Translation;

interface SearchPageProps {
    items: ISearchItem[];
    page: number;
    lang?: Lang;
    isMobile?: boolean;
}

type RenderFound = SearchPageProps & SearchOnClickProps & PaginatorProps & Translation;

type SearchPageInnerProps = SearchPageProps &
    SearchOnClickProps &
    InputProps &
    PaginatorProps &
    WithTranslation &
    WithTranslationProps;

const SearchPage = ({
    query = '',
    items = [],
    page = 1,
    lang = Lang.En,
    isMobile,
    i18n,
    t,
    totalItems,
    maxPages,
    itemsPerPage,
    onPageChange,
    onSubmit,
    onQueryUpdate,
    itemOnClick,
    irrelevantOnClick,
    relevantOnClick,
}: SearchPageInnerProps) => {
    if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
    }

    const inputRef = useRef(null);

    return (
        <main className={b()}>
            <div className={b('layout')}>
                <div className={b('search-input')}>
                    {renderInput({query, onQueryUpdate, onSubmit, inputRef, t})}
                </div>
                <div className={b('content')}>
                    {items?.length && query ? (
                        renderFound({
                            items,
                            page,
                            lang,
                            isMobile,
                            t,
                            totalItems,
                            maxPages,
                            itemsPerPage,
                            itemOnClick,
                            onPageChange,
                            irrelevantOnClick,
                            relevantOnClick,
                        })
                    ) : (
                        <div className={b('search-empty')}>
                            <h3>{t('search_not-found-title')}</h3>
                            <div>{t('search_not-found-text')}</div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

function renderFound({
    lang,
    items,
    itemOnClick,
    irrelevantOnClick,
    relevantOnClick,
    page,
    totalItems = 0,
    maxPages,
    onPageChange,
    itemsPerPage,
    isMobile,
    t,
}: RenderFound) {
    return (
        <div className={b('search-result')}>
            <h3 className={b('subtitle')}>{t('search_request-query')}</h3>
            <div className={b('search-list')}>
                {items.map((item: ISearchItem) => (
                    <SearchItem
                        lang={lang}
                        key={item.title}
                        item={item}
                        className={b('search-item')}
                        itemOnClick={itemOnClick}
                        irrelevantOnClick={irrelevantOnClick}
                        relevantOnClick={relevantOnClick}
                    />
                ))}
            </div>
            <div className={b('paginator')}>
                <Paginator
                    page={page}
                    totalItems={totalItems}
                    maxPages={maxPages}
                    onPageChange={onPageChange}
                    itemsPerPage={itemsPerPage}
                    isMobile={isMobile}
                />
            </div>
        </div>
    );
}

function renderInput({query, onQueryUpdate, onSubmit, inputRef, t}: RenderInput) {
    return (
        <div className={b('search-field')}>
            <form onSubmit={onSubmit}>
                <div className={b('search-field-wrapper')}>
                    <TextInput
                        controlRef={inputRef}
                        size="l"
                        value={query}
                        autoFocus={true}
                        placeholder={t('search_placeholder')}
                        onUpdate={onQueryUpdate}
                        hasClear={true}
                    />
                    <Button
                        className={b('search-button')}
                        view="action"
                        size="l"
                        onClick={onSubmit}
                    >
                        {t('search_action')}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default withTranslation('search')(SearchPage);
