import type {UseTranslationResponse} from 'react-i18next';
import type {Loc} from '../config/i18n';
import type {SuggestItemType} from '../components/SearchSuggest/types';
import type {LabelProps} from '@gravity-ui/uikit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TFunction = UseTranslationResponse<any, undefined>['t'];

export type OnChangeValue = (value: ControlTypes) => void;
export type ControlTypes =
    | string
    | boolean
    | Theme
    | Lang
    | TextSizes
    | FeedbackSendData
    | SubscribeData;

export enum Theme {
    Light = 'light',
    Dark = 'dark',
}

export enum TextSizes {
    S = 's', // 13px
    M = 'm', // 15px
    L = 'l', // 17px
}

export enum ControlSizes {
    M = 'm',
    L = 'l',
    XL = 'xl',
}

export interface Config {
    lang?: string;
    loc?: Loc;
    localeCode?: string;
}

export interface DocSettings {
    fullScreen?: boolean;
    singlePage?: boolean;
    wideFormat?: boolean;
    showMiniToc?: boolean;
    bookmarkedPage?: boolean;
    theme?: Theme;
    textSize?: TextSizes;
    isLiked?: boolean;
    isDisliked?: boolean;
    dislikeVariants?: string[];
}

export interface DocBasePageData<T extends {} = {}> {
    toc: T & TocData;
    leading?: boolean;
    footer?: React.ReactNode;
}

export interface DocLeadingPageData extends DocBasePageData {
    leading: true;
    data: DocLeadingData;
}

export interface DocContentPageData<T extends {} = {}> extends DocBasePageData {
    leading: true;
    data: T & {
        fullScreen?: boolean;
    };
    children?: React.ReactNode;
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

export enum VcsType {
    Github = 'github',
    Arcanum = 'arcanum',
}

export interface DocPageData extends DocBasePageData {
    leading?: false;
    breadcrumbs?: BreadcrumbItem[];
    viewerInterface?: Record<string, boolean>;
    html: string;
    title?: string;
    headings: DocHeadingItem[];
    meta: DocMeta;
    vcsUrl?: string;
    vcsType?: VcsType;
    mdxArtifacts?: Record<string, unknown>;
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
    author?: unknown | Contributor;
    __system?: Record<string, unknown>;
    updatedAt?: string;
    canonical?: string;
    alternate?: Alternate[];
}

export interface TocLabel {
    title: string;
    description?: string;
    theme?: LabelProps['theme'];
}

export interface TocData {
    title?: string;
    href?: string;
    items?: TocItem[];
    stage?: string;
    editable?: boolean;
    singlePage?: boolean;
    label?: TocLabel;
    extraHeader?: React.ReactNode;
}

export interface TocItem {
    id: string;
    name: string;
    href?: string;
    items?: TocItem[];
    expanded?: boolean;
    labeled?: boolean;
}

export interface BreadcrumbItem {
    name: string;
    url?: string;
}

export interface Router {
    hostname?: string;
    pathname: string;
    hash?: string;
}

export enum Lang {
    Ru = 'ru',
    En = 'en',
    He = 'he',
    Es = 'es',
    Fr = 'fr',
    Cs = 'cs',
    Ar = 'ar',
}

export type Alternate = {
    href: string;
    hreflang?: string;
};

export interface Contributor {
    avatar: string;
    login: string;
    url: string;
    name: string | null;
    email: string | null;
}

export interface DislikeData {
    answers: string[];
    comment: string;
}

export enum FeedbackType {
    like = 'like',
    dislike = 'dislike',
    indeterminate = 'indeterminate',
}

export interface FeedbackSendData {
    type: FeedbackType;
    answers?: string[];
    comment?: string;
}

export enum SubscribeType {
    documentation = 'documentation',
    page = 'page',
}

export interface SubscribeData {
    email: string;
    type: SubscribeType;
}

export enum DocumentType {
    Base = 'BASE',
    Leading = 'LEADING',
    PageConstructor = 'PAGE_CONSTRUCTOR',
}

export interface ListItem {
    value: string;
    text: string;
}

export interface ClassNameProps {
    className?: string;
}

export interface ISearchProvider {
    init(): void | (() => void);
    suggest(query: string): Promise<ISearchResult[]>;
    search(
        query: string,
    ): Promise<ISearchResult[]> | Promise<{items: ISearchResult[]; total: number}>;
    link(query: string): string | null;
}

export interface ISearchResult {
    type: SuggestItemType;
    title: string;
    link: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export type Query = Record<string, number | string | null>;

export type AvailableLangs = readonly (`${Lang}` | Lang)[];
