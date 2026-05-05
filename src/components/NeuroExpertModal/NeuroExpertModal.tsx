import type {FC} from 'react';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Dialog, Loader, Text} from '@gravity-ui/uikit';
import {useTranslation} from 'react-i18next';
import block from 'bem-cn-lite';

import {CommonAnalyticsEvent, useAnalytics} from '../../shared/libs/analytics';
import {AiIcon} from '../SearchSuggest';

import './NeuroExpertModal.scss';

const b = block('dc-neuro-expert-modal');

const IFRAME_BASE_URL = 'https://expert.yandex.ru/expert/projects';
const IFRAME_ORIGIN = 'https://expert.yandex.ru';

const IFRAME_ACTION_MAP: Record<string, string> = {
    'message-sent': 'message',
};

export interface NeuroExpertModalProps {
    open: boolean;
    query: string;
    projectId: string;
    onClose: () => void;
}

const HeaderCaption = () => {
    const {t} = useTranslation('search-suggest');

    return (
        <div className={b('header-caption')}>
            <AiIcon />
            <Text variant="subheader-2">{t('search-suggest_ai-chat')}</Text>
        </div>
    );
};

export const NeuroExpertModal: FC<NeuroExpertModalProps> = ({open, query, projectId, onClose}) => {
    const analytics = useAnalytics();
    const [loaded, setLoaded] = useState<boolean>(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const iframeSrc = `${IFRAME_BASE_URL}/${projectId}/iframe`;

    const trackAction = useCallback(
        (action: string) => {
            analytics.track(CommonAnalyticsEvent.DOCS_NEUROEXPERT_ACTION, {
                action,
                initType: 'search',
            });
        },
        [analytics],
    );

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.source !== iframeRef.current?.contentWindow) {
                return;
            }

            const type = event.data?.type;

            if (type === 'chat-mounted' && !loaded) {
                setLoaded(true);
            }

            const mappedAction = IFRAME_ACTION_MAP[type];
            if (mappedAction) {
                trackAction(mappedAction);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => window.removeEventListener('message', handleMessage);
    }, [loaded, trackAction]);

    useEffect(() => {
        if (open) {
            trackAction('open');
        }
    }, [open, trackAction]);

    useEffect(() => {
        if (!open || !loaded) {
            return;
        }

        iframeRef.current?.contentWindow?.postMessage(
            {type: 'send-message', payload: {text: query}},
            IFRAME_ORIGIN,
        );
    }, [open, loaded, query]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            hasCloseButton
            keepMounted={loaded}
            className={b()}
            modalClassName={b('modal')}
        >
            <Dialog.Header className={b('header')} caption={<HeaderCaption />} />
            <Dialog.Body className={b('body')}>
                <div className={b('container')}>
                    <iframe
                        ref={iframeRef}
                        src={iframeSrc}
                        style={{width: '100%', height: '100%', border: 'none'}}
                    />
                </div>
                {!loaded && (
                    <div className={b('loader')}>
                        <Loader size="l" />
                    </div>
                )}
            </Dialog.Body>
        </Dialog>
    );
};
