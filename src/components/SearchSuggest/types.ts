import type {BreadcrumbItem} from '../../models';
import type {ReactNode} from 'react';

export enum SuggestItemType {
    Text = 'text',
    Page = 'page',
    Group = 'group',
    Delimiter = 'delimiter',
    Link = 'link',
    Action = 'action',
}

interface SearchSuggestBaseItem {
    type: SuggestItemType;
    disabled?: boolean;
    icon?: ReactNode;
    hint?: ReactNode;
}

interface SearchSuggestTextItem extends SearchSuggestBaseItem {
    type: SuggestItemType.Text;
    title: string;
}

export interface SearchSuggestPageItem extends SearchSuggestBaseItem {
    type: SuggestItemType.Page;
    title: string;
    link: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
}

interface SearchSuggestGroupItem extends SearchSuggestBaseItem {
    type: SuggestItemType.Group;
    title: string;
}

interface SearchSuggestDelimiterItem extends SearchSuggestBaseItem {
    type: SuggestItemType.Delimiter;
}

interface SearchSuggestLinkItem extends SearchSuggestBaseItem {
    type: SuggestItemType.Link;
    title: string;
    link: string;
}

export interface SearchSuggestActionItem extends SearchSuggestBaseItem {
    type: SuggestItemType.Action;
    title: string;
    description: string;
    onClick: () => void;
}

export type SearchSuggestLinkableItem = SearchSuggestPageItem | SearchSuggestLinkItem;

export type SearchSuggestItem =
    | SearchSuggestActionItem
    | SearchSuggestLinkableItem
    | SearchSuggestTextItem
    | SearchSuggestGroupItem
    | SearchSuggestDelimiterItem;

export type SearchGroup = {
    type: SuggestItemType;
    items: SearchSuggestItem[];
};
