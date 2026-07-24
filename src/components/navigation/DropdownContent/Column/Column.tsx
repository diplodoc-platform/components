import type {FC} from 'react';
import type {NavigationColumnItem} from '../../types';

import {Section} from '../Section';
import {useSections} from '../../hooks';
import {cnDropdownContent} from '../utils';

import './Column.scss';

export interface ColumnProps {
    data: NavigationColumnItem;
}

export const Column: FC<ColumnProps> = (props) => {
    const {data} = props;
    const {items} = useSections(data);

    return (
        <div className={cnDropdownContent('column')}>
            {items.map((item, index) => (
                <Section key={index} data={item} />
            ))}
        </div>
    );
};
