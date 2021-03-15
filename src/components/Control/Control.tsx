import React from 'react';
import block from 'bem-cn-lite';

import {ControlButton} from '../ControlButton';
import {Popup, PopupPosition} from '../Popup';

import './Control.scss';

const b = block('dc-control');

export interface ControlProps {
    onClick: () => void;
    setRef?: (ref: HTMLButtonElement) => void;
    isVerticalView?: boolean;
    tooltipText: string;
    className?: string;
}

interface ControlState {
    showTooltip: boolean;
}

class Control extends React.Component<ControlProps, ControlState> {
    controlRef?: HTMLButtonElement;

    state: ControlState = {
        showTooltip: false,
    };

    render() {
        const {children, onClick, className, tooltipText} = this.props;
        const {showTooltip} = this.state;
        const position = this.getTooltipAlign();

        return (
            <React.Fragment>
                <ControlButton
                    onClick={onClick}
                    buttonRef={this.setRef}
                    onMouseOver={this.showTooltip}
                    onMouseLeave={this.hideTooltip}
                    className={b(null, className)}
                >
                    {children}
                </ControlButton>
                <Popup
                    anchor={this.controlRef}
                    visible={showTooltip}
                    onOutsideClick={this.hideTooltip}
                    className={b('tooltip')}
                    position={position}
                >
                    <span className={b('tooltip-text')}>
                        {tooltipText}
                    </span>
                </Popup>
            </React.Fragment>
        );
    }

    private setRef = (ref: HTMLButtonElement) => {
        const {setRef} = this.props;

        this.controlRef = ref;

        if (typeof setRef === 'function') {
            setRef(ref);
        }
    };

    private showTooltip = () => {
        this.setState({showTooltip: true});
    };

    private hideTooltip = () => {
        this.setState({showTooltip: false});
    };

    private getTooltipAlign() {
        return this.props.isVerticalView ? PopupPosition.left : PopupPosition.bottom;
    }
}

export default Control;
