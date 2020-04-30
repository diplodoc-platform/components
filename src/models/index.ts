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

export interface DocPageData extends DocBasePageData {
    leading?: false;
    breadcrumbs: BreadcrumbItem[];
    html: string;
    title: string;
    headings: DocHeadingItem[];
    meta: DocMeta;
    githubUrl?: string;
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
    stage: string;
    editable?: boolean;
}

export interface TocItem {
    id: string;
    name: string;
    href: string;
    items?: TocItem[];
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
