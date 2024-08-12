import React, {useRef, useState} from 'react';

import {Button, Loader, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {useTranslation} from '../../hooks';
import {GenerativeSearchAnswer, IGenerativeSearch} from '../GenerativeSearchAnswer';
import {Paginator, PaginatorProps} from '../Paginator';
import {ISearchItem, SearchItem, SearchOnClickProps} from '../SearchItem';

import './SearchPage.scss';

const b = block('dc-search-page');

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
} & InputProps;

type RenderNoContent = Loading;

interface SearchPageProps extends Loading {
    items: ISearchItem[];
    page: number;
    isMobile?: boolean;
    loading?: boolean;
}

interface GenerativeSearchProps {
    generativeSearchData: IGenerativeSearch;
    generativeSearchLoading: boolean;
    generativeSearchError: boolean;
    generativeSearchNoData: boolean;
}

type RenderFoundProps = SearchPageProps & SearchOnClickProps & PaginatorProps;

type SearchPageInnerProps = SearchPageProps &
    SearchOnClickProps &
    InputProps &
    PaginatorProps &
    GenerativeSearchProps;

const FoundBlock: React.FC<RenderFoundProps> = ({
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
}) => {
    const {t} = useTranslation('search');

    return (
        <div className={b('search-result')}>
            <h3 className={b('subtitle')}>{t<string>('search_request-query')}</h3>

            <div className={b('search-list')}>
                {items.map((item: ISearchItem) => (
                    <SearchItem
                        key={item.url}
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
};

const WithoutContentBlock: React.FC<RenderNoContent> = ({loading}) => {
    const {t} = useTranslation('search');

    return loading ? (
        <Loader />
    ) : (
        <>
            <div className={b('search-empty')}>
                <h3>{t<string>('search_not-found-title')}</h3>
                <div>{t<string>('search_not-found-text')}</div>
            </div>
        </>
    );
};

const InputBlock: React.FC<RenderInput> = ({query, onQueryUpdate, onSubmit, inputRef}) => {
    const {t} = useTranslation('search');

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
                        {t<string>('search_action')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

const SearchPage = ({
    query = '',
    items = [],
    page = 1,
    isMobile,
    totalItems,
    maxPages,
    itemsPerPage,
    onPageChange,
    onSubmit,
    itemOnClick,
    irrelevantOnClick,
    relevantOnClick,
    loading,
    generativeSearchData,
    generativeSearchLoading,
    generativeSearchError,
}: SearchPageInnerProps) => {
    const inputRef = useRef(null);
    const [currentQuery, setCurrentQuery] = useState(query);

    return (
        <div className={b('layout')}>
            <div className={b('search-input')}>
                <InputBlock
                    {...{
                        query: currentQuery,
                        onQueryUpdate: setCurrentQuery,
                        onSubmit,
                        inputRef,
                    }}
                />
            </div>
            <div className={b('generative-answer')}>
                <GenerativeSearchAnswer
                    {...{
                        generativeSearchData,
                        generativeSearchLoading,
                        generativeSearchError,
                    }}
                />
            </div>
            <div className={b('content')}>
                {items?.length && query ? (
                    <FoundBlock
                        {...{
                            items,
                            page,
                            isMobile,
                            totalItems,
                            maxPages,
                            itemsPerPage,
                            itemOnClick,
                            onPageChange,
                            irrelevantOnClick,
                            relevantOnClick,
                        }}
                    />
                ) : (
                    <WithoutContentBlock loading={loading} />
                )}
            </div>
        </div>
    );
};

export default SearchPage;
