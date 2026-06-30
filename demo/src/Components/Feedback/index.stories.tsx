import React from 'react';
import {Feedback as Component, InterfaceProvider} from '@diplodoc/components';

type Args = {
    isLiked: boolean;
    isDisliked: boolean;
};

const FeedbackDemo = (args: Args) => {
    const isLiked = args['isLiked'];
    const isDisliked = args['isDisliked'];

    const onSendFeedback = () => {};

    return (
        <InterfaceProvider interface={{'feedback-comment': true}}>
            <Component isLiked={isLiked} isDisliked={isDisliked} onSendFeedback={onSendFeedback} />
        </InterfaceProvider>
    );
};

export default {
    title: 'Components/Feedback',
    component: FeedbackDemo,
    argTypes: {
        isLiked: {
            control: 'boolean',
        },
        isDisliked: {
            control: 'boolean',
        },
    },
};

export const Feedback = {
    args: {
        isLiked: false,
        isDisliked: false,
    },
};
