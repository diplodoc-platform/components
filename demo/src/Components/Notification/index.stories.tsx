import React from 'react';
import {Notification as Component} from '@diplodoc/components';

const NotificationDemo = (args: Record<string, string>) => {
    const currentType = args['Type'];
    const currentTitle = args['Title'];
    const currentContent = args['Content'];

    return (
        <Component
            notification={{
                title: currentTitle,
                content: currentContent,
                type: currentType,
            }}
            notificationCb={() => alert('Hello')}
        />
    );
};

export default {
    title: 'Components/Notification',
    component: NotificationDemo,
    argTypes: {
        Type: {
            control: 'select',
            options: {
                info: 'info',
                tip: 'tip',
                warning: 'warning',
                alert: 'alert',
            },
        },
        Title: {
            control: 'text',
        },
    },
};

export const Notification = {
    args: {
        Type: 'info',
        Title: 'Test title',
        Content: 'Test content',
    },
};
