import type {BreadcrumbItem} from '../../models';

export enum SuggestItemType {
    Text = 'text',
    Page = 'page',
    Group = 'group',
    Delimiter = 'delimiter',
    Link = 'link',
}

interface SearchSuggestBaseItem {
    type: SuggestItemType;
    disabled?: boolean;
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
    section?: string;
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

export type SearchSuggestLinkableItem = SearchSuggestPageItem | SearchSuggestLinkItem;

export type SearchSuggestItem =
    | SearchSuggestLinkableItem
    | SearchSuggestTextItem
    | SearchSuggestGroupItem
    | SearchSuggestDelimiterItem;

export type SearchGroup = {
    type: SuggestItemType;
    items: SearchSuggestItem[];
};
