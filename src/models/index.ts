export enum Theme {
    Light = 'light',
    Dark = 'dark'
}

export enum TextSizes {
    S = 's', // 13px
    M = 'm', // 15px
    L = 'l' // 17px
}

export enum ControlSizes {
    S = 's',
    M = 'm'
}

export enum ButtonThemes {
    Flat = 'flat',
    Float = 'float',
    Action = 'action',
    Like = 'like'
}

export interface DocSettings {
    fullScreen?: boolean;
    singlePage?: boolean;
    wideFormat?: boolean;
    showMiniToc?: boolean;
    theme?: Theme;
    textSize?: TextSizes;
    isLiked?: boolean;
    isDisliked?: boolean;
    dislikeVariants?: string[];
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
    description?: string;
    href?: string;
    imgSrc?: string;
    links?: DocLeadingLinks[];
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
    description?: string;
    keywords?: string[];
    stage?: string;
    editable?: boolean;
    contributors?: Contributor[];
    author?: Contributor;
    __system?: Record<string, unknown>;
}

export interface TocData {
    title: string;
    href: string;
    items: TocItem[];
    stage?: string;
    editable?: boolean;
    singlePage?: boolean;
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
    hash?: string;
}

export enum Lang {
    Ru = 'ru',
    En = 'en'
}

export interface Contributor {
    avatar: string;
    login: string;
    name: string;
    email: string;
    url: string;
}

export interface DislikeData {
    answers: string[];
    comment: string;
}

export enum FeedbackType {
    like = 'like',
    dislike = 'dislike',
    indeterminate = 'indeterminate'
}

export interface FeedbackSendData {
    type: FeedbackType;
    answers?: string[];
    comment?: string;
}
