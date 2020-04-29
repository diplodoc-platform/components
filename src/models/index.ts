export interface TocItem {
    id: string;
    name: string;
    href: string;
    items?: TocItem[];
}

export interface TocData {
    title: string;
    href: string;
    items: TocItem[];
    stage: string;
    editable?: boolean;
}

export interface HeadingItem {
    title: string;
    href: string;
    level: number;
    items?: HeadingItem[];
}

export interface Router {
    pathname: string;
}

export enum Lang {
    Ru = 'ru',
    En = 'en'
}
