import React, {useRef} from 'react';
import {Helmet} from 'react-helmet';
import block from 'bem-cn-lite';
import {TextInput, Button} from '@gravity-ui/uikit';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import {Paginator, PaginatorProps} from '../Paginator';
import {ISearchItem, SearchItem, SearchOnClickProps} from '../SearchItem';
import {Lang} from '../../models';

import './SearchPage.scss';

const b = block('dv-search-page');

interface SearchPageProps {
    query: string;
    items: ISearchItem[];
    page: number;
    metaTitle?: string;
    onSubmit: () => void;
    onQueryUpdate: (arg: string) => void;
    lang?: Lang;
    isMobile?: boolean;
}

type SearchPageInnerProps = SearchPageProps &
    SearchOnClickProps &
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
    metaTitle,
    totalItems = 0,
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

    const renderInput = () => {
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
    };

    const renderNotFound = () => {
        return (
            <div className={b('search-empty')}>
                <h3>{t('search_not-found-title')}</h3>
                <div>{t('search_not-found-text')}</div>
            </div>
        );
    };

    const renderItems = () => {
        if (!query) {
            return null;
        }

        return (
            <div className={b('search-list')}>
                {items?.length
                    ? items.map((item: ISearchItem) => (
                          <SearchItem
                              lang={lang}
                              key={item.title}
                              item={item}
                              className={b('search-item')}
                              itemOnClick={itemOnClick}
                              irrelevantOnClick={irrelevantOnClick}
                              relevantOnClick={relevantOnClick}
                          />
                      ))
                    : renderNotFound()}
            </div>
        );
    };

    const renderPaginator = () => {
        return (
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
        );
    };

    const renderFound = () => {
        return (
            <div className={b('search-result')}>
                <h3 className={b('subtitle')}>{t('search_request-query')}</h3>
                {renderItems()}
                {renderPaginator()}
            </div>
        );
    };

    const renderResult = () => {
        if (!query) {
            return null;
        }

        return items?.length ? renderFound() : renderNotFound();
    };

    return (
        <main className={b()}>
            <Helmet title={metaTitle} />
            <div className={b('layout')}>
                <div className={b('search-input')}>{renderInput()}</div>
                <div className={b('content')}>{renderResult()}</div>
            </div>
        </main>
    );
};

export default withTranslation('search')(SearchPage);
