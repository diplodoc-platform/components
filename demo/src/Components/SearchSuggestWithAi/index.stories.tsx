import type {FC, PropsWithChildren} from 'react';
import type {ISearchProvider, ISearchResult, ISearchResultWithLink} from '@diplodoc/components';

import React, {useState} from 'react';
import {SearchSuggest as Component, SuggestItemType} from '@diplodoc/components';
import block from 'bem-cn-lite';
import {ArrowUpRightFromSquare, SparklesFill} from '@gravity-ui/icons';
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

const AiIcon = ({className}: {className?: string}) => {
    return (
        <span className={className}>
            <Icon data={SparklesFill} size={16} />
        </span>
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

            const items: ISearchResult[] = filter(data as ISearchResultWithLink[], query)
                .slice(0, 10)
                .map((item) => ({
                    ...item,
                    icon: <PageIcon />,
                    hint: ENTER_HINT,
                }));

            if (items.length > 0) {
                items.unshift({
                    type: SuggestItemType.Action,
                    title: query,
                    description: 'Спросить у AI',
                    icon: <AiIcon />,
                    hint: ENTER_HINT,
                    onClick: () => {
                        alert('clicked');
                    },
                });
            }
            return items;
        },

        async search() {
            return [];
        },

        link(query: string) {
            return query;
        },

        onEmptyAction(query: string) {
            return {
                type: SuggestItemType.Action,
                title: query,
                description: `Спросить у AI`,
                icon: <AiIcon />,
                hint: ENTER_HINT,
                onClick: () => alert(`clicked ${query}`),
            };
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
