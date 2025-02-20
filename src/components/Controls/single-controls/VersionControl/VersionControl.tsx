import React, {useCallback, useState} from 'react';
import {Select} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {useTranslation} from 'src/hooks';

export interface VersionControlProps {
    version: string;
    versions: string[];
    onChange: (version: string) => void;
    className?: string;
}

const b = block('dc-controls');

const VersionControl: React.FC<VersionControlProps> = (props) => {
    const {version: defaultVersion, versions, className, onChange} = props;
    const [version, setVersion] = useState<string>(defaultVersion);

    const {t} = useTranslation('header');

    const onUpdate = useCallback(
        (selected: string[]) => {
            onChange(selected[0]);
            setVersion(selected[0]);
        },
        [onChange, setVersion],
    );

    return (
        <Select
            placeholder={t('versions-select-placeholder')}
            value={[version]}
            options={versions.map((value) => ({value, content: value}))}
            onUpdate={onUpdate}
            className={b('control', className)}
        />
    );
};

export default VersionControl;
