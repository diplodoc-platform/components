import type {DropdownMenuItem} from '@gravity-ui/uikit';
import type {MarkdownActionsMode} from '../../../contexts/InterfaceContext';

import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Copy, LogoMarkdown, SquareCheck} from '@gravity-ui/icons';
import {Button, DropdownMenu, Icon} from '@gravity-ui/uikit';

import {useTranslation} from '../../../hooks';
import {CommonAnalyticsEvent, useAnalytics} from '../../../shared/libs/analytics';
import {ControlsLayoutContext} from '../ControlsLayout';

import {type MarkdownAction, getMarkdownUrl, setMarkdownAction} from './markdown-url';

const COPY_SUCCESS_TIMEOUT = 2000;

export {getMarkdownUrl} from './markdown-url';

type CopyState = 'idle' | 'pending' | 'success';

export interface MarkdownControlProps {
    mode?: Exclude<MarkdownActionsMode, 'none'>;
    mdDocsUrl?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
}

const MarkdownControl: React.FC<MarkdownControlProps> = ({
    mode = 'dropdown',
    mdDocsUrl,
    onClick,
}) => {
    const {t} = useTranslation('markdown-button');
    const analytics = useAnalytics();
    const {controlClassName, controlSize} = useContext(ControlsLayoutContext);
    const [copyState, setCopyState] = useState<CopyState>('idle');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const ignoreNextClose = useRef(false);
    const copySuccessTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const resolveMarkdownUrl = useCallback(
        (action: MarkdownAction) => {
            if (!mdDocsUrl) {
                return getMarkdownUrl(window.location.href, action);
            }

            return setMarkdownAction(new URL(mdDocsUrl, window.location.href), action);
        },
        [mdDocsUrl],
    );

    useEffect(
        () => () => {
            if (copySuccessTimer.current) {
                clearTimeout(copySuccessTimer.current);
            }
        },
        [],
    );

    const copyMarkdown = useCallback(async () => {
        if (copyState === 'pending') {
            return;
        }

        analytics.track(CommonAnalyticsEvent.DOCS_COPY_AS_MARKDOWN_CLICK);
        if (copySuccessTimer.current) {
            clearTimeout(copySuccessTimer.current);
            copySuccessTimer.current = undefined;
        }
        setCopyState('pending');

        try {
            const response = await fetch(resolveMarkdownUrl('copy'), {
                credentials: 'same-origin',
                headers: {Accept: 'text/markdown'},
            });

            if (!response.ok || !response.headers.get('content-type')?.includes('text/markdown')) {
                throw new Error(`Failed to load Markdown: ${response.status}`);
            }

            await navigator.clipboard.writeText(await response.text());
            setCopyState('success');

            copySuccessTimer.current = setTimeout(() => {
                copySuccessTimer.current = undefined;
                setCopyState('idle');
            }, COPY_SUCCESS_TIMEOUT);
        } catch {
            setCopyState('idle');
        }
    }, [analytics, copyState, resolveMarkdownUrl]);

    const handleCopy = useCallback(() => {
        ignoreNextClose.current = mode === 'dropdown';
        copyMarkdown();
    }, [copyMarkdown, mode]);

    const viewMarkdown = useCallback<NonNullable<DropdownMenuItem<unknown>['action']>>(
        (event) => {
            analytics.track(CommonAnalyticsEvent.DOCS_VIEW_AS_MARKDOWN_CLICK);

            if ('nativeEvent' in event) {
                onClick?.(event);
            }

            window.open(resolveMarkdownUrl('view'), '_blank', 'noopener,noreferrer');
        },
        [analytics, onClick, resolveMarkdownUrl],
    );

    const items = useMemo<DropdownMenuItem<unknown>[]>(
        () => [
            {
                text: t('copy-as-markdown'),
                iconStart: <Icon data={copyState === 'success' ? SquareCheck : Copy} size={16} />,
                disabled: copyState === 'pending',
                className: `dc-markdown-control__copy_${copyState}`,
                action: handleCopy,
            },
            {
                text: t('view-in-markdown'),
                iconStart: <Icon data={LogoMarkdown} size={16} />,
                action: viewMarkdown,
            },
        ],
        [copyState, handleCopy, t, viewMarkdown],
    );

    const handleDropdownToggle = useCallback((open: boolean) => {
        if (!open && ignoreNextClose.current) {
            ignoreNextClose.current = false;
            return;
        }

        setDropdownOpen(open);
    }, []);

    if (mode === 'visible') {
        return (
            <React.Fragment>
                <Button
                    className={`${controlClassName || ''} dc-markdown-control__copy_${copyState}`.trim()}
                    size={controlSize}
                    view="flat-secondary"
                    disabled={copyState === 'pending'}
                    data-copy-state={copyState}
                    onClick={handleCopy}
                >
                    <Button.Icon>
                        {copyState === 'success' ? <SquareCheck /> : <Copy />}
                    </Button.Icon>
                    {t('copy-as-markdown')}
                </Button>
                <Button
                    className={controlClassName}
                    size={controlSize}
                    view="flat-secondary"
                    onClick={viewMarkdown}
                >
                    <Button.Icon>
                        <LogoMarkdown />
                    </Button.Icon>
                    {t('view-in-markdown')}
                </Button>
            </React.Fragment>
        );
    }

    return (
        <DropdownMenu
            items={items}
            open={dropdownOpen}
            onOpenToggle={handleDropdownToggle}
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
