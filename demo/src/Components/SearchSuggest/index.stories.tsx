import type {SearchProvider, SearchResult} from '@diplodoc/components';

import React, {useState} from 'react';
import {SearchSuggest as Component} from '@diplodoc/components';
import block from 'bem-cn-lite';

import data from './page.json';
import './index.scss';

const b = block('header');

const wait = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

const filter = (items: SearchResult[], query: string) => {
    return items.filter((item) => {
        return item.title?.indexOf(query) > -1 || item.description?.indexOf(query) > -1;
    });
};

const FakeHeader = ({children, className}) => {
    return (
        <div className={b(null, className)}>
            <div className="header-left">
                <div className="header-logo"></div>
                <div className="header-title">Example</div>
            </div>
            <div className="header-center"></div>
            <div className="header-right">{children}</div>
        </div>
    );
};

const SearchSuggestDemo = () => {
    const provider: SearchProvider = {
        async suggest(query: string) {
            await wait(3000);

            return filter(data, query).slice(0, 10);
        },

        link(query: string) {
            return query;
        },
    };

    const [search, setSearch] = useState(false);

    return (
        <FakeHeader className={b(null, [search && 'with-search'].filter(Boolean))}>
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
