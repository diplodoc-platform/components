import type {FooterProps} from '@gravity-ui/navigation';
import type {FooterLogoConfig, FooterMenuItemConfig} from './types';

export function mapMenuItems(items?: FooterMenuItemConfig[]): FooterProps['menuItems'] {
    if (!items || items.length === 0) {
        return undefined;
    }

    return items.map((item) => ({
        text: item.text || '',
        href: item.url,
        target: item.target ?? '_blank',
    }));
}

export function mapLogo(logo?: string | FooterLogoConfig): FooterProps['logo'] | undefined {
    if (typeof logo === 'string') {
        return {
            text: '',
            iconSrc: logo,
        };
    }

    if (logo) {
        return {
            text: logo.text || '',
            iconSrc: logo.icon,
            iconSize: logo.iconSize,
            href: logo.url,
        };
    }

    return undefined;
}
