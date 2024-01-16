import React, {memo, useMemo} from 'react';

import block from 'bem-cn-lite';

import {getConfig} from '../../config';
import {useTranslation} from '../../hooks';
import {format} from '../../utils/date';

import './UpdatedAtDate.scss';

const b = block('updated-at-date');

export interface UpdatedAtDateProps {
    updatedAt: string;
    translationName?: string;
}

const UpdatedAtDate: React.FC<UpdatedAtDateProps> = (props) => {
    const {updatedAt, translationName = 'updated-at-date'} = props;
    const {t} = useTranslation(translationName);

    const updatedAtFormatted = useMemo(() => {
        const {localeCode} = getConfig();
        return format(updatedAt, 'longDateTime', localeCode);
    }, [updatedAt]);

    return (
        <div className={b()}>
            <div className={b('title')}>{t<string>('title')}</div>
            {updatedAtFormatted}
        </div>
    );
};

export default memo(UpdatedAtDate);
