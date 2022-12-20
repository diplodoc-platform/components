import React, {useRef, useState} from 'react';
import block from 'bem-cn-lite';
import {TextInput, Button, Loader} from '@gravity-ui/uikit';
import {TFunction, withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import {Paginator, PaginatorProps} from '../Paginator';
import {ISearchItem, SearchItem, SearchOnClickProps} from '../SearchItem';
import {Lang} from '../../models';

import './SearchPage.scss';

const b = block('dc-search-page');

interface Translation {
    t: TFunction<'translation'>;
}

interface Loading {
    loading?: boolean;
}

interface InputProps {
    query: string;
    onSubmit: (query: string) => void;
}

type RenderInput = {
    inputRef: React.MutableRefObject<null>;
    onQueryUpdate: (arg: string) => void;
} & InputProps &
    Translation;

type RenderNoContent = Loading & Translation;

interface SearchPageProps extends Loading {
    items: ISearchItem[];
    page: number;
    lang?: Lang;
    isMobile?: boolean;
    loading?: boolean;
}

type RenderFoundProps = SearchPageProps & SearchOnClickProps & PaginatorProps & Translation;

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
    itemOnClick,
    irrelevantOnClick,
    relevantOnClick,
    loading,
}: SearchPageInnerProps) => {
    if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
    }

    const inputRef = useRef(null);
    const [currentQuery, setCurrentQuery] = useState(query);

    return (
        <div className={b('layout')}>
            <div className={b('search-input')}>
                {renderInput({
                    query: currentQuery,
                    onQueryUpdate: setCurrentQuery,
                    onSubmit,
                    inputRef,
                    t,
                })}
            </div>
            <div className={b('content')}>
                {items?.length && query
                    ? renderFound({
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
                    : renderWithoutContent({loading, t})}
            </div>
        </div>
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
}: RenderFoundProps) {
    return (
        <div className={b('search-result')}>
            <h3 className={b('subtitle')}>{t('search_request-query')}</h3>
            <div className={b('search-list')}>
                {items.map((item: ISearchItem) => (
                    <SearchItem
                        lang={lang}
                        key={item.url}
                        item={item}
                        className={b('search-item')}
                        itemOnClick={itemOnClick ? (arg) => itemOnClick(arg) : undefined}
                        irrelevantOnClick={(arg) =>
                            irrelevantOnClick ? irrelevantOnClick(arg) : undefined
                        }
                        relevantOnClick={(arg) =>
                            relevantOnClick ? relevantOnClick(arg) : undefined
                        }
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

function renderWithoutContent({loading, t}: RenderNoContent) {
    return loading ? (
        <Loader />
    ) : (
        <div className={b('search-empty')}>
            <h3>{t('search_not-found-title')}</h3>
            <div>{t('search_not-found-text')}</div>
        </div>
    );
}

function renderInput({query, onQueryUpdate, onSubmit, inputRef, t}: RenderInput) {
    return (
        <div className={b('search-field')}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit(query);
                }}
            >
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
                        onClick={(event) => {
                            event.preventDefault();
                            onSubmit(query);
                        }}
                    >
                        {t('search_action')}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default withTranslation('search')(SearchPage);
