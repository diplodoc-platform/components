import type {FC} from 'react';

import React, {useEffect, useRef, useState} from 'react';
import {Dialog, Loader, Text} from '@gravity-ui/uikit';
import {useTranslation} from 'react-i18next';
import block from 'bem-cn-lite';

import {AiIcon} from '../SearchSuggest';

import './NeuroExpertModal.scss';

const b = block('dc-neuro-expert-modal');

const IFRAME_BASE_URL = 'https://expert.yandex.ru/expert/projects';

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
    const [loaded, setLoaded] = useState<boolean>(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const iframeSrc = `${IFRAME_BASE_URL}/${projectId}/iframe`;

    useEffect(() => {
        if (loaded) {
            return;
        }

        const handleMessage = (event: MessageEvent) => {
            if (event.source !== iframeRef.current?.contentWindow) {
                return;
            }

            if (event.data?.type === 'chat-mounted') {
                setLoaded(true);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => window.removeEventListener('message', handleMessage);
    }, [loaded]);

    useEffect(() => {
        if (!open || !loaded) {
            return;
        }

        iframeRef.current?.contentWindow?.postMessage(
            {type: 'send-message', payload: {text: query}},
            '*',
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
