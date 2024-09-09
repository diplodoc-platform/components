import React, {ReactNode, SVGProps, memo, useMemo, useState} from 'react';
import {ChevronDown} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {ListItem, OnChangeValue} from '../../../models';
import MobileControlSheet from '../MobileControlSheet/MobileControlSheet';

import './MobileControl.scss';

const b = block('dc-mobile-control');

export interface MobileControlProps {
    name: string;
    title: string;
    buttonLabel?: string;
    Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
    selectedItem: ReactNode;
    selectedItemIndex: number;
    displayItems: ListItem[];
    onChangeValue?: OnChangeValue;
}

const MobileControl = memo(
    ({
        name,
        title,
        buttonLabel,
        Icon,
        selectedItem,
        selectedItemIndex,
        displayItems,
        onChangeValue,
    }: MobileControlProps) => {
        const labelText = useMemo(
            () =>
                displayItems.find((displayItem) => selectedItem === displayItem.value)?.text ??
                selectedItem,
            [selectedItem, displayItems],
        );

        const [sheetIsVisible, setSheetIsVisible] = useState(false);

        const onSheetOpen = () => setSheetIsVisible(true);
        const onSheetClose = () => setSheetIsVisible(false);
        const onItemClick = (value: string) => (onChangeValue ? onChangeValue(value) : null);

        return (
            <div key={name} className={b()}>
                <MobileControlSheet
                    title={title}
                    items={displayItems}
                    onItemClick={onItemClick}
                    isVisible={sheetIsVisible}
                    onClose={onSheetClose}
                    selectedItemIndex={selectedItemIndex}
                />
                <Button view={'flat'} size={'s'} className={b('wrapper')} onClick={onSheetOpen}>
                    <div className={b('label')}>
                        <Icon width={16} height={16} />
                        {buttonLabel ?? labelText}
                    </div>
                    <Button.Icon className={b('arrow')} side={'right'}>
                        <ChevronDown width={16} height={16} />
                    </Button.Icon>
                </Button>
            </div>
        );
    },
);

MobileControl.displayName = 'MobileControl';

export default MobileControl;
