import type {ButtonSize, ButtonView} from '@gravity-ui/uikit';
import type {ClassNameProps} from '../../models';

import React, {useCallback, useRef} from 'react';
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

const COPIED_HINT_TIMEOUT = 3000;

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
    const copiedHint = usePopupState({autoclose: COPIED_HINT_TIMEOUT});

    const clickHandler = useCallback(() => {
        shareHandler().then((result) => {
            if (result === 'copied') {
                copiedHint.open();
            }
        });
    }, [shareHandler, copiedHint]);

    const copied = copiedHint.visible;
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
                    open={copied}
                    onOpenChange={(open) => {
                        if (!open) {
                            copiedHint.close();
                        }
                    }}
                    className={b('tooltip')}
                    placement="bottom-end"
                    returnFocus={false}
                >
                    <span className={b('tooltip-text')}>{t('link-copied-text')}</span>
                </Popup>
            )}
        </React.Fragment>
    );
};
