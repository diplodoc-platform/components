import React, {useState} from 'react';
import block from 'bem-cn-lite';

import './TextInput.scss';

const b = block('dc-text-input');

export interface TextInputProps {
    text?: string;
    className?: string;
    placeholder?: string;
    onChange?: Function;
}

export const TextInput: React.FC<TextInputProps> = (props) => {
    const {className, placeholder, onChange} = props;
    const [value, setValue] = useState(props.text ?? '');

    return (
        <span className={className}>
            <input
                className={b()}
                placeholder={placeholder}
                value={value}
                onChange={(event) => {
                    const val = event.target.value || '';
                    setValue(val);

                    if (onChange) {
                        onChange(val);
                    }
                }}
            />
        </span>
    );
};
