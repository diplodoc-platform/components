import type {KeyboardEvent, SyntheticEvent} from 'react';

import React, {forwardRef, memo} from 'react';
import {TextInput, TextInputSize} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

type SuggestInputProps = {
    id: string;
    text: string;
    size?: TextInputSize;
    autoFocus?: boolean;
    placeholder?: string;
    endContent?: React.ReactNode;
    onUpdate?: (item: string) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    onFocus?: (event: SyntheticEvent) => void;
    onBlur?: (event: SyntheticEvent) => void;
    className?: string;
    controlProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const b = block('dc-search-input');

export const SearchInput = memo(
    forwardRef<HTMLElement, SuggestInputProps>((props, ref) => {
        const {
            id,
            text,
            size,
            autoFocus,
            placeholder,
            endContent,
            onBlur,
            onFocus,
            onUpdate,
            onKeyDown,
            className,
            controlProps,
        } = props;

        return (
            <TextInput
                ref={ref}
                size={size}
                value={text}
                placeholder={placeholder}
                endContent={endContent}
                autoComplete={false}
                autoFocus={autoFocus}
                hasClear={false}
                onBlur={onBlur}
                onUpdate={onUpdate}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
                className={b('input', className)}
                id={id}
                controlProps={{
                    role: 'combobox',
                    'aria-autocomplete': 'list',
                    ...(controlProps || {}),
                }}
            />
        );
    }),
);

SearchInput.displayName = 'SuggestInput';
