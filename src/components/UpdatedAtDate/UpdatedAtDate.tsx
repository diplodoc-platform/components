import React, {memo, useMemo} from 'react';

import block from 'bem-cn-lite';

import {getConfig} from '../../config';
import {useTranslation} from '../../hooks';
import {format} from '../../utils/date';

import './UpdatedAtDate.scss';

const b = block('dc-updated-at-date');

export interface UpdatedAtDateProps {
    updatedAt: string;
}

const UpdatedAtDate: React.FC<UpdatedAtDateProps> = ({updatedAt}) => {
    const {t} = useTranslation('updated-at-date');

    const updatedAtFormatted = useMemo(() => {
        const {localeCode} = getConfig();
        return format(updatedAt, 'longDate', localeCode);
    }, [updatedAt]);

    return (
        <div className={b()}>
            {t<string>('title')} {updatedAtFormatted}
        </div>
    );
};

export default memo(UpdatedAtDate);
