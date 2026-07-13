import type {FooterProps} from '@gravity-ui/navigation';
import type {CustomFooterProps, FooterMenuItemConfig} from './types';

export function resolveTarget(target?: 'self' | 'blank'): '_self' | '_blank' {
    if (target === 'self') {
        return '_self';
    }

    return '_blank';
}

export function mapMenuItems(items?: FooterMenuItemConfig[]): FooterProps['menuItems'] {
    if (!items || items.length === 0) {
        return undefined;
    }

    return items.map((item) => ({
        text: item.text || '',
        href: item.url,
        target: resolveTarget(item.target),
    }));
}

export function mapLogo(logo: CustomFooterProps['logo']): FooterProps['logo'] | undefined {
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

export function buildFooterProps(props: CustomFooterProps): FooterProps {
    const {
        className,
        withDivider,
        view,
        moreButtonTitle,
        copyright = '',
        logo,
        logoWrapperClassName,
        menuItems,
    } = props;

    const footerProps: FooterProps = {
        className,
        withDivider,
        view,
        moreButtonTitle,
        copyright,
        logoWrapperClassName,
        menuItems: mapMenuItems(menuItems),
    };

    const mappedLogo = mapLogo(logo);

    if (mappedLogo) {
        footerProps.logo = mappedLogo;
    }

    return footerProps;
}
