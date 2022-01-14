import React from 'react';
import block from 'bem-cn-lite';

import TickIcon from '../../../assets/icons/checkbox-tick.svg';

import './Checkbox.scss';

export interface CheckboxProps {
    name?: string;
    size?: 'm' | 'l';
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: boolean) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    controlProps?: React.InputHTMLAttributes<HTMLInputElement>;
    controlRef?: React.Ref<HTMLInputElement>;
    label?: React.ReactNode;
    className?: string;
}

const b = block('dc-checkbox');

export function Checkbox({
    name,
    size = 'm',
    checked,
    defaultChecked = false,
    disabled = false,
    onChange,
    onFocus,
    onBlur,
    controlProps,
    label,
    className,
}: CheckboxProps) {
    const [checkedState, setCheckedState] = React.useState(checked ?? defaultChecked ?? false);

    React.useEffect(() => {
        if (checked) {
            setCheckedState(checked);
        }
    }, [checked]);

    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setCheckedState(event.target.checked);

            if (onChange) {
                onChange(event, event.target.checked);
            }
        },
        [onChange],
    );

    return (
        <label
            className={b(
                {
                    size,
                    disabled,
                    checked: typeof checked === 'boolean' ? checked : checkedState,
                },
                className,
            )}
        >
            <span className={b('indicator')}>
                <span className={b('icon')} aria-hidden>
                    <TickIcon className={b('icon-svg', {type: 'tick'})} />
                </span>
                <input
                    {...controlProps}
                    type="checkbox"
                    name={name}
                    checked={checked}
                    defaultChecked={defaultChecked}
                    disabled={disabled}
                    aria-checked={Boolean(checkedState)}
                    onChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className={b('control')}
                />
                <span className={b('outline')} />
            </span>
            {label && <span className={b('text')}>{label}</span>}
        </label>
    );
}
