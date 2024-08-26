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

interface SearchSuggestPageItem extends SearchSuggestBaseItem {
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

export type SearchSuggestLinkableItem = SearchSuggestPageItem | SearchSuggestLinkItem;

export type SearchSuggestItem =
    | SearchSuggestLinkableItem
    | SearchSuggestTextItem
    | SearchSuggestGroupItem
    | SearchSuggestDelimiterItem;

export type SearchResult = {
    type: SuggestItemType;
    title: string;
    link: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
};

export type SearchGroup = {
    type: SuggestItemType;
    items: SearchSuggestItem[];
};

export type SearchProvider = {
    suggest(query: string): Promise<SearchResult[]>;
    link(query: string): string;
};
