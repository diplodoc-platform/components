import type {DropdownMenuItem} from '@gravity-ui/uikit';

import React, {useCallback, useContext, useMemo} from 'react';
import {Copy, LogoMarkdown} from '@gravity-ui/icons';
import {DropdownMenu, Icon} from '@gravity-ui/uikit';

import {useTranslation} from '../../../hooks';
import {ControlsLayoutContext} from '../ControlsLayout';

export function getMarkdownUrl(currentUrl: string) {
    const markdownUrl = new URL(currentUrl);

    if (markdownUrl.pathname.endsWith('/')) {
        markdownUrl.pathname += 'index.md';
    } else {
        markdownUrl.pathname = markdownUrl.pathname.replace(/\.(?:html?|md)$/i, '') + '.md';
    }

    return markdownUrl.toString();
}

export interface MarkdownControlProps {
    mdDocsUrl?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
}

const MarkdownControl: React.FC<MarkdownControlProps> = ({mdDocsUrl, onClick}) => {
    const {t} = useTranslation('markdown-button');
    const {controlClassName, controlSize} = useContext(ControlsLayoutContext);
    const resolveMarkdownUrl = useCallback(
        () => mdDocsUrl || getMarkdownUrl(window.location.href),
        [mdDocsUrl],
    );

    const copyMarkdown = useCallback(async () => {
        const response = await fetch(resolveMarkdownUrl(), {
            credentials: 'same-origin',
            headers: {Accept: 'text/markdown'},
        });

        if (!response.ok || !response.headers.get('content-type')?.includes('text/markdown')) {
            throw new Error(`Failed to load Markdown: ${response.status}`);
        }

        await navigator.clipboard.writeText(await response.text());
    }, [resolveMarkdownUrl]);

    const viewMarkdown = useCallback<NonNullable<DropdownMenuItem<unknown>['action']>>(
        (event) => {
            if ('nativeEvent' in event) {
                onClick?.(event);
            }

            window.open(resolveMarkdownUrl(), '_blank', 'noopener,noreferrer');
        },
        [onClick, resolveMarkdownUrl],
    );

    const items = useMemo<DropdownMenuItem<unknown>[]>(
        () => [
            {
                text: t('copy-as-markdown'),
                iconStart: <Icon data={Copy} size={16} />,
                action: () => {
                    copyMarkdown().catch(() => undefined);
                },
            },
            {
                text: t('view-in-markdown'),
                iconStart: <Icon data={LogoMarkdown} size={16} />,
                action: viewMarkdown,
            },
        ],
        [copyMarkdown, t, viewMarkdown],
    );

    return (
        <DropdownMenu
            items={items}
            size={controlSize}
            switcherWrapperClassName={controlClassName}
            defaultSwitcherProps={{
                'aria-label': t('markdown-actions'),
                view: 'flat-secondary',
            }}
            popupProps={{placement: ['bottom-end', 'top-end']}}
        />
    );
};

export default MarkdownControl;
