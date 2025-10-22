import React, {useEffect, useState} from 'react';

import './NeuroExpertWidget.scss';

interface NeuroExpertWidgetParams {
    parentId: string;
}

const NeuroExpertWidget: React.FC<NeuroExpertWidgetParams> = (props) => {
    const {parentId} = props;
    const [bottomOffset, setBottomOffset] = useState<number>(0);

    useEffect(() => {
        const chatButton = document.querySelector<HTMLElement>('.ya-chat-button-ui');

        if (chatButton) {
            setBottomOffset(60);
        }
    }, []);

    return <div id={parentId} className="dc-ne-widget" style={{bottom: bottomOffset}} />;
};

export default NeuroExpertWidget;
