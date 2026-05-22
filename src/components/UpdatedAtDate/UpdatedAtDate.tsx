import React, {memo, useMemo} from 'react';
import block from 'bem-cn-lite';

import {getConfig} from '../../config';
import {useTranslation} from '../../hooks';
import {format} from '../../utils/date';

import './UpdatedAtDate.scss';

const b = block('dc-updated-at-date');

export interface UpdatedAtDateProps {
    updatedAt: string;
    hasAuthor: boolean;
}

const UpdatedAtDate: React.FC<UpdatedAtDateProps> = ({updatedAt, hasAuthor}) => {
    const {t} = useTranslation('updated-at-date');

    const updatedAtFormatted = useMemo(() => {
        const {localeCode} = getConfig();
        return format(updatedAt, 'longDate', localeCode);
    }, [updatedAt]);

    const titleKey = hasAuthor ? 'title' : 'no-author-title';

    return (
        <div className={b()}>
            <div className={b('wrapper')}>
                {t(titleKey)} {updatedAtFormatted}
            </div>
        </div>
    );
};

export default memo(UpdatedAtDate);
