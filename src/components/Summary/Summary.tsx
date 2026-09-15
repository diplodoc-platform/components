import type {FC} from 'react';

import block from 'bem-cn-lite';

import './Summary.scss';

const b = block('dc-summary');

export interface SummaryProps {
    summary?: string;
}

const Summary: FC<SummaryProps> = ({summary}) => {
    if (!summary) {
        return null;
    }

    return (
        <div className={b()}>
            <p className={b('text')}>{summary}</p>
        </div>
    );
};

export default Summary;
