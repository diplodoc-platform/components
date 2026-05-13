import type {NavigationLinkItem} from '@gravity-ui/page-constructor';

export type {NavigationLinkItem};

export interface NavigationSectionItem {
    type: 'section';
    title?: string;
    items: NavigationLinkItem[];
}

export interface NavigationColumnItem {
    type: 'column';
    items: Array<NavigationSectionItem | NavigationLinkItem>;
}
