import React, {useCallback, useState, useRef} from 'react';
import block from 'bem-cn-lite';
import {WithTranslation, withTranslation} from 'react-i18next';

import {SubscribeSuccessPopup} from './SubscribeSuccessPopup';
import {SubscribeVariantsPopup} from './SubscribeVariantsPopup';
import {Button} from '@gravity-ui/uikit';
import {Control} from '../Control';

import {SubscribeData, Lang} from '../../models';

import SubscribeIcon from '../../../assets/icons/subscribe.svg';

import './Subscribe.scss';

const b = block('dc-subscribe');

export enum SubscribeView {
    Wide = 'wide',
    Regular = 'regular',
}

export interface SubscribeProps {
    lang: Lang;
    isVerticalView?: boolean;
    onSubscribe?: (data: SubscribeData) => void;
    view?: SubscribeView;
    classNameControl?: string;
}

const Subscribe: React.FC<SubscribeProps & WithTranslation> = React.memo((props) => {
    const {isVerticalView, onSubscribe, view, classNameControl, t} = props;

    const subscribeControlRef = useRef<HTMLButtonElement | null>(null);

    const [showSubscribeSuccessPopup, setShowSubscribeSuccessPopup] = useState(false);
    const [showSubscribeVariantsPopup, setShowSubscribeVariantsPopup] = useState(false);

    const setSubscribeControlRef = useCallback((ref) => {
        subscribeControlRef.current = ref;
    }, []);

    const onChangeSubscribe = useCallback(() => {
        setShowSubscribeVariantsPopup(!showSubscribeVariantsPopup);
        setShowSubscribeSuccessPopup(false);
    }, [showSubscribeVariantsPopup]);

    const renderSubscribeControl = useCallback(() => {
        return (
            <Control
                onClick={onChangeSubscribe}
                className={b('control', {view}, classNameControl)}
                isVerticalView={isVerticalView}
                tooltipText={t(`subscribe-text`)}
                setRef={setSubscribeControlRef}
                icon={(args) => <SubscribeIcon {...args} />}
            />
        );
    }, [classNameControl, view, isVerticalView, setSubscribeControlRef, onChangeSubscribe, t]);

    const renderWideSubscribeControls = useCallback(() => {
        return (
            <div className={b('container', {view})}>
                <div className={b('container-row', {view})}>
                    <h3 className={b('title', {view})}>{t('main-question')}</h3>
                    <div className={b('controls', {view})}>
                        <Button
                            view="flat-secondary"
                            ref={setSubscribeControlRef}
                            onClick={onChangeSubscribe}
                            className={b('control', {view})}
                        >
                            <SubscribeIcon className={b('subscribe-button')} />
                            {t('button-Subscribe-text')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [view, setSubscribeControlRef, onChangeSubscribe, t]);

    const renderSubscribeControls = useCallback(() => {
        return view === SubscribeView.Regular
            ? renderSubscribeControl()
            : renderWideSubscribeControls();
    }, [view, renderSubscribeControl, renderWideSubscribeControls]);

    return (
        <React.Fragment>
            {renderSubscribeControls()}
            {showSubscribeSuccessPopup && subscribeControlRef.current && (
                <SubscribeSuccessPopup
                    visible={showSubscribeSuccessPopup}
                    setVisible={setShowSubscribeSuccessPopup}
                    {...{view, isVerticalView, anchor: subscribeControlRef, t}}
                />
            )}
            {showSubscribeVariantsPopup && subscribeControlRef.current && (
                <SubscribeVariantsPopup
                    visible={showSubscribeVariantsPopup}
                    setVisible={setShowSubscribeVariantsPopup}
                    onSubscribe={onSubscribe}
                    onSubmit={() => {
                        setShowSubscribeVariantsPopup(false);
                        setShowSubscribeSuccessPopup(true);
                    }}
                    {...{view, isVerticalView, anchor: subscribeControlRef, t}}
                />
            )}
        </React.Fragment>
    );
});

Subscribe.displayName = 'Subscribe';

export default withTranslation('controls')(Subscribe);
