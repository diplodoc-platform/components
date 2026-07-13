import type {FC} from 'react';
import type {NavigationLinkItem} from '../../types';

import {NavigationItem, NavigationLayout, block} from '@gravity-ui/page-constructor';

const b = block('navigation-popup');

export interface ListProps {
    items: NavigationLinkItem[];
}

export const List: FC<ListProps> = (props) => {
    const {items} = props;

    return (
        <ul className={b('list')}>
            {items.map((item, index) => (
                <NavigationItem
                    key={index}
                    className={b('link')}
                    data={item}
                    menuLayout={NavigationLayout.Dropdown}
                />
            ))}
        </ul>
    );
};
