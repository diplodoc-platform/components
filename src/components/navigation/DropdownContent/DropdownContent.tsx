import type {FC} from 'react';
import type {NavigationColumnItem, NavigationLinkItem, NavigationSectionItem} from '../types';

import {useColumns} from '../hooks';

import {cnDropdownContent} from './utils';
import {Column} from './Column';
import './DropdownContent.scss';

export interface DropdownContentProps {
    items: Array<NavigationSectionItem | NavigationLinkItem | NavigationColumnItem>;
}

export const DropdownContent: FC<DropdownContentProps> = (props) => {
    const {items} = useColumns(props);

    return (
        <div className={cnDropdownContent()}>
            {items.map((item, index) => {
                return <Column key={index} data={item} />;
            })}
        </div>
    );
};
