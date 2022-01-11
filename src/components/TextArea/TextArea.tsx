import React, {MouseEvent} from 'react';
import block from 'bem-cn-lite';

import {TextAreaControl, TextAreaProps} from './TextAreaControl';
import CloseIcon from '../../../assets/icons/close.svg';

import './TextArea.scss';

const b = block('dc-text-area');

export const TextArea: React.FC<TextAreaProps> = React.memo((props) => {
    const {
        className,
        clear,
        disabled,
        value,
        size = 'm',
        autoComplete,
        controlRef,
        onChange,
    } = props;
    const innerControlRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [hasVerticalScrollbar, setHasVerticalScrollbar] = React.useState(false);

    React.useEffect((): void => {
        if (controlRef) {
            controlRef.current = innerControlRef.current;
        }
    }, [controlRef]);

    const handleOnChange = React.useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
            if (onChange) {
                onChange(event, event.target.value);
            }
        },
        [onChange],
    );

    const handleClear = React.useCallback(
        (event: MouseEvent<HTMLSpanElement>): void => {
            const control = innerControlRef.current;

            if (control && onChange) {
                control.focus();

                const syntheticEvent = Object.create(event);
                syntheticEvent.target = control;
                syntheticEvent.currentTarget = control;

                control.value = '';

                onChange(syntheticEvent, '');
            }
        },
        [onChange],
    );

    React.useEffect(() => {
        const control = innerControlRef.current;

        if (control) {
            const currHasVerticalScrollbar = control.scrollHeight > control.clientHeight;

            if (hasVerticalScrollbar !== currHasVerticalScrollbar) {
                setHasVerticalScrollbar(currHasVerticalScrollbar);
            }
        }
    }, [value, hasVerticalScrollbar]);

    const isClearControlVisible = clear && !disabled && value;

    return (
        <span className={b(null, className)}>
            <TextAreaControl
                {...props}
                className={b('control', {disabled, clear})}
                controlRef={innerControlRef}
                onChange={handleOnChange}
                autoComplete={autoComplete ? 'on' : 'off'}
                size={size}
            />

            {isClearControlVisible && (
                <span
                    className={b('clear-control', {
                        multiline: true,
                        size,
                        scrollbar: hasVerticalScrollbar,
                    })}
                    onClick={handleClear}
                >
                    <CloseIcon className={b('close-icon')} />
                </span>
            )}
        </span>
    );
});

TextArea.displayName = 'DCTextArea';

export default TextArea;
