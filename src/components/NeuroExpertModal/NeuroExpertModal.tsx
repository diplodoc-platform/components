import type {FC} from 'react';

import React, {useEffect, useRef, useState} from 'react';
import {Dialog, Loader, Text} from '@gravity-ui/uikit';
import {useTranslation} from 'react-i18next';
import block from 'bem-cn-lite';

import {AiIcon} from '../SearchSuggest';

import './NeuroExpertModal.scss';

const b = block('dc-neuro-expert-modal');

const PARENT_ID = 'dc-neuro-expert-chat';
const IFRAME_BASE_URL = 'https://expert.yandex.ru/expert/projects';
const MOUNT_DELAY = 1500;

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
    const [loading, setLoading] = useState(true);
    const pollRef = useRef<number>();
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    useEffect(() => {
        if (!open || !query || !projectId) {
            return;
        }

        setLoading(true);

        function tryMount() {
            const container = document.getElementById(PARENT_ID);

            if (!container) {
                pollRef.current = window.setTimeout(tryMount, 30);

                return;
            }

            container.innerHTML = '';

            const iframe = document.createElement('iframe');
            iframe.src = `${IFRAME_BASE_URL}/${projectId}/iframe`;
            iframe.style.cssText = 'width:100%;height:100%;border:none;';
            iframeRef.current = iframe;

            iframe.addEventListener(
                'load',
                () => {
                    setTimeout(() => {
                        setLoading(false);
                        iframe.contentWindow?.postMessage(
                            {type: 'send-message', payload: {text: query}},
                            '*',
                        );
                    }, MOUNT_DELAY);
                },
                {once: true},
            );

            container.appendChild(iframe);
        }

        tryMount();

        return () => {
            if (pollRef.current) {
                clearTimeout(pollRef.current);
            }
        };
    }, [open, query, projectId]);

    useEffect(() => {
        if (!open) {
            iframeRef.current = null;
            setLoading(true);
            const container = document.getElementById(PARENT_ID);
            if (container) {
                container.innerHTML = '';
            }
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            hasCloseButton
            className={b()}
            modalClassName={b('modal')}
        >
            <Dialog.Header className={b('header')} caption={<HeaderCaption />} />
            <Dialog.Body className={b('body')}>
                <div id={PARENT_ID} className={b('container')} />
                {loading && open && (
                    <div className={b('loader')}>
                        <Loader size="l" />
                    </div>
                )}
            </Dialog.Body>
        </Dialog>
    );
};
