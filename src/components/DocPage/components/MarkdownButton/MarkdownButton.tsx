import React from 'react';
import {LogoMarkdown} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import {useTranslation} from '../../../../hooks';

export interface MarkdownButtonProps {
    mdDocsUrl: string;
}

const MarkdownButton: React.FC<MarkdownButtonProps> = ({mdDocsUrl}) => {
    const {t} = useTranslation('markdown-button');

    return (
        <Button size="m" href={mdDocsUrl} target="_blank">
            <Icon data={LogoMarkdown} /> {t('view-in-markdown')}
        </Button>
    );
};

export default MarkdownButton;
