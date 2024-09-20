import type {FC, PropsWithChildren} from 'react';
import type {ISearchProvider, ISearchResult} from '@diplodoc/components';

import React, {useState} from 'react';
import {SearchSuggest as Component} from '@diplodoc/components';
import block from 'bem-cn-lite';

import data from './page.json';
import './index.scss';

const b = block('header');

const wait = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

const filter = (items: ISearchResult[], query: string) => {
    return items.filter((item) => {
        return item.title?.indexOf(query) > -1 || (item.description || '').indexOf(query) > -1;
    });
};

type Props = {
    className: string;
};

const FakeHeader: FC<PropsWithChildren<Props>> = ({children, className}) => {
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
