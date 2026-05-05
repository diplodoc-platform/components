import type {FC, PropsWithChildren} from 'react';
import type {ISearchProvider, ISearchResultWithLink} from '@diplodoc/components';

import React, {useState} from 'react';
import {AiIcon, SearchSuggest as Component} from '@diplodoc/components';
import block from 'bem-cn-lite';
import {ArrowUpRightFromSquare} from '@gravity-ui/icons';
import {Icon, Text} from '@gravity-ui/uikit';

import data from '../SearchSuggestWithAi/page.json';
import '../SearchSuggestWithAi/index.scss';

const b = block('header');

const wait = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

const filter = (items: ISearchResultWithLink[], query: string) => {
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

const PageIcon = () => {
    return (
        <span>
            <Icon data={ArrowUpRightFromSquare} size={16} />
        </span>
    );
};

const SearchSuggestDemo = () => {
    const ENTER_HINT = (
        <Text variant="body-short" color="secondary">
            ENTER
        </Text>
    );

    const provider: ISearchProvider = {
        init() {},

        async suggest(query: string) {
            await wait(3000);

            return filter(data as ISearchResultWithLink[], query)
                .slice(0, 10)
                .map((item) => ({
                    ...item,
                    icon: <PageIcon />,
                    hint: ENTER_HINT,
                }));
        },

        async search() {
            return [];
        },

        link(query: string) {
            return query;
        },
    };

    const [search, setSearch] = useState<boolean>(false);
    const className = [search && 'with-search'].filter(Boolean) as string[];

    return (
        <FakeHeader className={b(null, className)}>
            <Component
                provider={provider}
                onFocus={() => setSearch(true)}
                onBlur={() => setSearch(false)}
                onAiAction={(query: string) => alert(`AI: ${query}`)}
                startContent={<AiIcon className={b('ai-icon')} />}
                withAllResults={false}
                hasClear={true}
                withFocusOverlay={true}
                emptyState={
                    <Text variant="body-short" color="secondary">
                        Не нашли подходящих статей
                    </Text>
                }
                focusFirstSearchResult={true}
            />
        </FakeHeader>
    );
};

export default {
    title: 'Pages/SearchSuggestWithAi',
    component: SearchSuggestDemo,
};

export const SearchSuggestWithAi = {};
