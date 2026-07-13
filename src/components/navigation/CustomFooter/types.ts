export interface FooterMenuItemConfig {
    text?: string;
    url?: string;
    target?: 'self' | 'blank';
}

export interface FooterLogoConfig {
    icon?: string;
    iconSize?: number;
    text?: string;
    url?: string;
    dark?: {icon?: string};
    light?: {icon?: string};
}

export interface CustomFooterProps {
    className?: string;
    withDivider?: boolean;
    view?: 'normal' | 'clear';
    moreButtonTitle?: string;
    copyright?: string;
    logo?: string | FooterLogoConfig;
    logoWrapperClassName?: string;
    menuItems?: FooterMenuItemConfig[];
}
