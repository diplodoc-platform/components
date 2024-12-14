import React from 'react';
import {Feedback as Component} from '@diplodoc/components';

type Args = {
    isLiked: boolean;
    isDisliked: boolean;
};

const FeedbackDemo = (args: Args) => {
    const isLiked = args['isLiked'];
    const isDisliked = args['isDisliked'];

    return <Component isLiked={isLiked} isDisliked={isDisliked} />;
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
