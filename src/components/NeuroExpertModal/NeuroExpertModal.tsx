import type {FC} from 'react';

import {useCallback, useEffect, useRef, useState} from 'react';
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
    /** Create a chat on load so the input is available without an initial query. */
    createChatOnInit?: boolean;
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

type NeuroExpertDialogProps = Pick<NeuroExpertModalProps, 'open' | 'query' | 'onClose'> & {
    iframeSrc: string;
};

const NeuroExpertDialog: FC<NeuroExpertDialogProps> = ({open, query, onClose, iframeSrc}) => {
    const analytics = useAnalytics();
    const [loaded, setLoaded] = useState<boolean>(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

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
        if (!open || !loaded || !query) {
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
            disableBodyScrollLock={!open}
        >
            <Dialog.Header className={b('header')} caption={<HeaderCaption />} />
            <Dialog.Body className={b('body')}>
                <div className={b('container')}>
                    <iframe
                        ref={iframeRef}
                        src={iframeSrc}
                        allow="clipboard-write"
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

export const NeuroExpertModal: FC<NeuroExpertModalProps> = ({
    open,
    query,
    projectId,
    createChatOnInit = false,
    onClose,
}) => {
    const [request, setRequest] = useState({projectId, open, query, shouldSendQuery: true});
    const projectChanged = projectId !== request.projectId;
    const requestChanged = open !== request.open || query !== request.query;
    // A project switch alone must not replay the previous question.
    const shouldSendQuery = requestChanged || (!projectChanged && request.shouldSendQuery);
    if (projectChanged || requestChanged) {
        setRequest({projectId, open, query, shouldSendQuery});
    }

    const iframeSrc = `${IFRAME_BASE_URL}/${projectId}/iframe${createChatOnInit ? '?createChatOnInit=true' : ''}`;

    // Wait for chat-mounted again when the iframe loads a different chat.
    return (
        <NeuroExpertDialog
            key={iframeSrc}
            iframeSrc={iframeSrc}
            open={open}
            query={shouldSendQuery ? query : ''}
            onClose={onClose}
        />
    );
};
