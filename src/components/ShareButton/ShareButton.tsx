import type {ButtonSize, ButtonView} from '@gravity-ui/uikit';
import type {ShareResult} from '../../hooks';
import type {ClassNameProps} from '../../models';

import React, {useCallback, useRef, useState} from 'react';
import {ArrowShapeTurnUpRight, Check} from '@gravity-ui/icons';
import {Button, Popup} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {usePopupState, useShareHandler, useTranslation} from '../../hooks';

import './ShareButton.scss';

const b = block('dc-share-button');

const ICON_SIZE = {
    width: 24,
    height: 24,
};

const HINT_TIMEOUT = 3000;

type IconSize = {
    width: number;
    height: number;
};

export interface ShareButtonProps extends ClassNameProps {
    title: string;
    iconSize?: IconSize;
    size?: ButtonSize;
    view?: ButtonView;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
    title,
    iconSize = ICON_SIZE,
    size = 'm',
    view = 'flat-secondary',
    className,
}) => {
    const {t} = useTranslation('share');
    const shareHandler = useShareHandler(title);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [copyResult, setCopyResult] = useState<Extract<ShareResult, 'copied' | 'failed'>>();
    const hint = usePopupState({autoclose: HINT_TIMEOUT});

    const clickHandler = useCallback(() => {
        shareHandler().then((result) => {
            // the system share sheet reports itself, only copying needs a hint
            if (result === 'copied' || result === 'failed') {
                setCopyResult(result);
                hint.open();
            }
        });
    }, [shareHandler, hint]);

    const copied = hint.visible && copyResult === 'copied';
    const Icon = copied ? Check : ArrowShapeTurnUpRight;

    return (
        <React.Fragment>
            <Button
                ref={buttonRef}
                className={b(null, className)}
                size={size}
                view={view}
                aria-label={t('share-text')}
                onClick={clickHandler}
            >
                <Button.Icon>
                    <Icon {...iconSize} />
                </Button.Icon>
            </Button>
            {buttonRef.current && (
                <Popup
                    anchorElement={buttonRef.current}
                    open={hint.visible}
                    onOpenChange={(open) => {
                        if (!open) {
                            hint.close();
                        }
                    }}
                    className={b('tooltip')}
                    placement="bottom-end"
                    returnFocus={false}
                >
                    <span className={b('tooltip-text')}>
                        {copied ? t('link-copied-text') : t('copy-failed-text')}
                    </span>
                </Popup>
            )}
        </React.Fragment>
    );
};
