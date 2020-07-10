import React from 'react';
import block from 'bem-cn-lite';

import './Tumbler.scss';

const b = block('dc-tumbler');

export interface TumblerProps {
    checked: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

export class Tumbler extends React.Component<TumblerProps> {
    render() {
        const {checked, disabled} = this.props;

        return (
            <div
                className={b({checked, disabled})}
                onClick={this.onChange}
            >
                <span className={b('box')}>
                    <button className={b('button')}/>
                </span>
            </div>
        );
    }

    private onChange = () => {
        const {checked, disabled, onChange} = this.props;

        if (disabled) {
            return;
        }

        onChange(!checked);
    };
}
