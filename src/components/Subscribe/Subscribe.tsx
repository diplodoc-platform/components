import React, {PropsWithChildren, forwardRef, memo, useCallback, useContext, useRef} from 'react';

import {Envelope} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {usePopupState, useTranslation} from '../../hooks';
import {SubscribeData} from '../../models';
import {Control} from '../Control';
import {ControlsLayoutContext} from '../Controls/ControlsLayout';

import {SubscribeSuccessPopup} from './SubscribeSuccessPopup';
import {SubscribeVariantsPopup} from './SubscribeVariantsPopup';

import './Subscribe.scss';

const b = block('dc-subscribe');

export enum SubscribeView {
    Wide = 'wide',
    Regular = 'regular',
}

export interface SubscribeProps {
    onSubscribe: (data: SubscribeData) => void;
    view?: SubscribeView;
}

type SubscribeControlProps = {
    view: SubscribeView;
    onChangeSubscribe: () => void;
};

const SubscribeControl = memo(
    forwardRef<HTMLButtonElement, SubscribeControlProps>(({view, onChangeSubscribe}, ref) => {
        const {isVerticalView, popupPosition, controlClassName, controlSize} =
            useContext(ControlsLayoutContext);
        const {t} = useTranslation('controls');

        if (view === SubscribeView.Wide) {
            return (
                <Button
                    view="flat-secondary"
                    ref={ref}
                    onClick={onChangeSubscribe}
                    className={b('control', {view})}
                >
                    <Button.Icon>
                        <Envelope width={16} height={16} />
                    </Button.Icon>
                    {t<string>('button-Subscribe-text')}
                </Button>
            );
        }

        return (
            <Control
                ref={ref}
                onClick={onChangeSubscribe}
                size={controlSize}
                className={b('control', {view}, controlClassName)}
                isVerticalView={isVerticalView}
                tooltipText={t(`subscribe-text`)}
                icon={Envelope}
                popupPosition={popupPosition}
            />
        );
    }),
);

SubscribeControl.displayName = 'SubscribeControl';

const SubscribeControlsLayout = memo<PropsWithChildren<{view: SubscribeView}>>(
    ({view, children}) => {
        const {t} = useTranslation('controls');

        if (view === SubscribeView.Regular) {
            return <React.Fragment>{children}</React.Fragment>;
        }

        return (
            <div className={b('container', {view})}>
                <div className={b('container-row', {view})}>
                    <h3 className={b('title', {view})}>{t<string>('main-question')}</h3>
                    <div className={b('controls', {view})}>{children}</div>
                </div>
            </div>
        );
    },
);

SubscribeControlsLayout.displayName = 'SubscribeControlsLayout';

const Subscribe = memo<SubscribeProps>((props) => {
    const {view = SubscribeView.Regular, onSubscribe} = props;

    const subscribeControlRef = useRef<HTMLButtonElement | null>(null);

    const successPopup = usePopupState({autoclose: 60000});
    const variantsPopup = usePopupState();

    const onChangeSubscribe = useCallback(() => {
        variantsPopup.toggle();
        successPopup.close();
    }, [successPopup, variantsPopup]);

    const onSubmitVariants = useCallback(() => {
        variantsPopup.close();
        successPopup.open();
    }, [successPopup, variantsPopup]);

    return (
        <React.Fragment>
            <SubscribeControlsLayout view={view}>
                <SubscribeControl
                    ref={subscribeControlRef}
                    view={view}
                    onChangeSubscribe={onChangeSubscribe}
                />
            </SubscribeControlsLayout>
            {successPopup.visible && subscribeControlRef.current && (
                <SubscribeSuccessPopup
                    view={view}
                    anchor={subscribeControlRef}
                    onOutsideClick={successPopup.close}
                />
            )}
            {variantsPopup.visible && subscribeControlRef.current && (
                <SubscribeVariantsPopup
                    view={view}
                    anchor={subscribeControlRef}
                    onOutsideClick={variantsPopup.close}
                    onSubscribe={onSubscribe}
                    onSubmit={onSubmitVariants}
                />
            )}
        </React.Fragment>
    );
});

Subscribe.displayName = 'Subscribe';

export default Subscribe;
