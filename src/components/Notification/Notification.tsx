import React, {useState} from 'react';
import {Button, Icon} from '@gravity-ui/uikit';
import {Xmark} from '@gravity-ui/icons';
import block from 'bem-cn-lite';

import {HTML} from '../HTML';

import './Notification.scss';

const bNote = block('dc-note');

export interface NotificationProps {
    notification?: {
        title?: string;
        content?: string;
        type?: string;
    };
    notificationCb?: () => void;
}

const Notification: React.FC<NotificationProps> = ({notification, notificationCb}) => {
    const [showNotification, setShowNotification] = useState(true);

    if (!notification || !showNotification) {
        return null;
    }

    const {title = '', content = '', type = ''} = notification;
    const isNoteTypeCorrect = ['info', 'tip', 'warning', 'alert'].includes(type.toLowerCase());

    return (
        <div className={bNote('wrapper')}>
            <div className={bNote({}, isNoteTypeCorrect ? `dc-accent-${type}` : bNote('template'))}>
                {title && <p className={bNote('title')}>{title}</p>}
                <Button
                    view={'flat'}
                    className={bNote('xmark')}
                    onClick={() => {
                        if (notificationCb) {
                            notificationCb();
                        }
                        setShowNotification(false);
                    }}
                >
                    <Icon data={Xmark} />
                </Button>
                {content && <HTML className={bNote('content')}>{content}</HTML>}
            </div>
        </div>
    );
};

export default Notification;
