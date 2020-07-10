import React from 'react';
import block from 'bem-cn-lite';

import './List.scss';

const b = block('dc-list');

export interface ListItem {
    text: string;
    description?: string;
    value?: string;
    icon?: React.ReactNode;
    control?: React.ReactNode;
}

export interface ListProps {
    items: ListItem[];
    value?: string;
    itemHeight?: number;
    onItemClick?: (item: ListItem) => void;
}

export class List extends React.Component<ListProps> {
    static ITEM_HEIGHT = 36;

    render() {
        return (
            <div className={b()}>
                <div className={b('items')}>
                    {this.renderItems()}
                </div>
            </div>
        );
    }

    private makeOnItemClick = (item: ListItem) => () => {
        const {onItemClick} = this.props;

        if (typeof onItemClick === 'function') {
            onItemClick(item);
        }
    };

    private renderItem = (item: ListItem, index: number) => {
        const {itemHeight = List.ITEM_HEIGHT, onItemClick, value: currentValue} = this.props;
        const {value, text, description, icon, control} = item;
        const isClickable = typeof onItemClick === 'function';
        const isActive = value ? currentValue === value : false;

        return (
            <div
                key={index}
                style={{height: itemHeight}}
                className={b('item', {
                    'clickable': isClickable,
                    'active': isActive,
                })}
                onClick={this.makeOnItemClick(item)}
            >
                {icon
                    ? <div className={b('item-icon')}>{icon}</div>
                    : null
                }
                <div className={b('item-content')}>
                    <div className={b('item-text')}>{text}</div>
                    {description
                        ? <div className={b('item-description')}>{description}</div>
                        : null
                    }
                </div>
                {control
                    ? <div className={b('item-control')}>{control}</div>
                    : null
                }
            </div>
        );
    };

    private renderItems() {
        const {items} = this.props;

        return (
            <div>
                {items.map((item: ListItem, index) => (
                    this.renderItem(item, index)
                ))}
            </div>
        );
    }
}
