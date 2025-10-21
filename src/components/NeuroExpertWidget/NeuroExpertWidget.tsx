import React from 'react';

import './NeuroExpertWidget.scss';

interface NeuroExpertWidgetParams {
    parentId: string;
}

const NeuroExpertWidget: React.FC<NeuroExpertWidgetParams> = (props) => {
    const {parentId} = props;

    return <div id={parentId} className="dc-ne-widget" />;
};

export default NeuroExpertWidget;
