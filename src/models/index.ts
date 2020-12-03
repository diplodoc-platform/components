export enum Theme {
    Light = 'light',
    Dark = 'dark'
}

export enum TextSizes {
    s = 's', // 13px
    m = 'm', // 15px
    l = 'l' // 17px
}

export interface DocSettings {
    fullScreen?: boolean;
    wideFormat?: boolean;
    showMiniToc?: boolean;
    theme?: Theme;
    textSize?: TextSizes;
}

export interface DocBasePageData {
    toc: TocData;
    leading?: boolean;
}

export interface DocLeadingPageData extends DocBasePageData {
    leading: true;
    data: DocLeadingData;
}

export interface DocLeadingData {
    title: string;
    description: string | string[];
    links: DocLeadingLinks[];
    meta: DocMeta;
}

export interface DocLeadingLinks {
    title: string;
    description: string;
    href: string;
}

export enum Vcs {
    Github = 'github',
    Arcanum = 'arcanum'
}

export interface DocPageData extends DocBasePageData {
    leading?: false;
    breadcrumbs: BreadcrumbItem[];
    html: string;
    title: string;
    headings: DocHeadingItem[];
    meta: DocMeta;
    vcsUrl?: string;
    vcsType?: Vcs;
}

export interface DocHeadingItem {
    title: string;
    href: string;
    level: number;
    items?: DocHeadingItem[];
}

export interface DocMeta {
    title?: string;
    stage?: string;
    editable?: boolean;
}

export interface TocData {
    title: string;
    href: string;
    items: TocItem[];
    stage?: string;
    editable?: boolean;
}

export interface TocItem {
    id: string;
    name: string;
    href?: string;
    items?: TocItem[];
    expanded?: boolean;
}

export interface BreadcrumbItem {
    name: string;
}

export interface Router {
    pathname: string;
}

export enum Lang {
    Ru = 'ru',
    En = 'en'
}
