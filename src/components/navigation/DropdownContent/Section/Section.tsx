import type {FC} from 'react';
import type {NavigationSectionItem} from '../../types';

import {Text} from '@gravity-ui/uikit';

import {List} from '../List';
import {cnDropdownContent} from '../utils';

import './Section.scss';

export interface SectionProps {
    data: NavigationSectionItem;
}

export const Section: FC<SectionProps> = (props) => {
    const {data} = props;
    const {title, items} = data;

    return (
        <div className={cnDropdownContent('section')}>
            {title && (
                <Text
                    className={cnDropdownContent('section-title')}
                    variant="body-2"
                    color="secondary"
                >
                    {title}
                </Text>
            )}

            <List items={items} />
        </div>
    );
};
