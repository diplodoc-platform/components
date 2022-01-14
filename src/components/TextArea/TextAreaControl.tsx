import React from 'react';
import block from 'bem-cn-lite';

import './TextAreaControl.scss';

export type ControlSize = 's' | 'm' | 'l' | 'xl';

export interface TextAreaProps {
    className?: string;
    name?: string; // HTML-атрибут name, если не передан должен быть сгенерирован автоматически
    size?: ControlSize;
    value?: string; // значение
    defaultValue?: string;
    disabled?: boolean;
    placeholder?: string;
    clear?: boolean; // кнопка очистки
    note?: string; // вспомогательный текст справа
    autoFocus?: boolean;
    autoComplete?: boolean;
    error?: string | boolean; // ошибка валидации
    rows?: number; // Количество строк textarea, если не указано, будет автовысота от контента
    maxRows?: number; // Ограничение при автовысоте
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>, value: string) => void;
    onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    controlRef?: React.MutableRefObject<HTMLTextAreaElement | null>;
    controlProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export interface TextAreaInnerProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        Pick<TextAreaProps, 'controlProps' | 'controlRef' | 'maxRows' | 'size'> {}

const b = block('dc-text-area-control');

export const TextAreaControl: React.FC<TextAreaInnerProps> = React.memo((props) => {
    const {
        className,
        name,
        autoFocus,
        autoComplete,
        size,
        placeholder,
        value,
        defaultValue,
        onChange,
        onFocus,
        onBlur,
        controlRef,
        controlProps,
        disabled,
        rows,
        maxRows,
    } = props;

    const resizeHeight = React.useCallback(() => {
        const control = controlRef?.current;

        if (control && !rows) {
            const textAreaBorderWidth = 1;

            control.style.height = 'auto';
            control.style.height = `${control.scrollHeight + 2 * textAreaBorderWidth}px`;
        }
    }, [controlRef, rows]);

    const onKeyPress = React.useCallback(
        (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (maxRows && typeof value === 'string' && event.which === 13) {
                const numberOfLines = (value.match(/\n/g) || []).length + 1;

                if (maxRows <= numberOfLines) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        },
        [value, maxRows],
    );

    React.useEffect(resizeHeight, [resizeHeight, value]);

    const isAutoResizable = !rows;

    return (
        <textarea
            {...controlProps}
            ref={controlRef}
            className={b({size, resizable: isAutoResizable}, className)}
            name={name}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            rows={rows || 1}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            onKeyPress={onKeyPress}
        />
    );
});

TextAreaControl.displayName = 'DCTextArea';
