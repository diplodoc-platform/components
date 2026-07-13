import type {ISearchProvider, ISearchResult} from '@diplodoc/components';

import {useState} from 'react';
import block from 'bem-cn-lite';
import {SearchSuggest as Component} from '@diplodoc/components';

import {FakeHeader, filter, wait} from '../shared/search-suggest';

import data from './page.json';
import './index.scss';

const b = block('header');

const SearchSuggestDemo = () => {
    const provider: ISearchProvider = {
        init() {},

        async suggest(query: string) {
            await wait(3000);

            return filter(data as ISearchResult[], query).slice(0, 10);
        },

        async search() {
            return [];
        },

        link(query: string) {
            return query;
        },
    };

    const [search, setSearch] = useState(false);
    const className = [search && 'with-search'].filter(Boolean) as string[];

    return (
        <FakeHeader className={b(null, className)}>
            <Component
                provider={provider}
                onFocus={() => setSearch(true)}
                onBlur={() => setSearch(false)}
            />
        </FakeHeader>
    );
};

export default {
    title: 'Components/SearchSuggest',
    component: SearchSuggestDemo,
};

export const SearchSuggest = {};
