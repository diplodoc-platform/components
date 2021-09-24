import React from 'react';
import cn from 'bem-cn-lite';
import {
    Controls,
    ControlsProps,
} from '../../../index';
import {
    Vcs,
} from '../../../models';
import {DISLIKE_VARIANTS} from '../../../constants';

const headBlock = cn('Header');
const layoutBlock = cn('Layout');

export interface HeaderProps extends ControlsProps {}

const Header: React.FC<HeaderProps> = ({
    lang,
    fullScreen,
    singlePage,
    onChangeFullScreen,
    onChangeLang,
    onSendFeedback,
    dislikeVariants = DISLIKE_VARIANTS[lang],
    isLiked,
    isDisliked,
    vcsUrl,
    vcsType,
    onChangeSinglePage,
}) => {
    return (
        <div className={layoutBlock('header')}>
            <div className={headBlock()}>
                <Controls
                    lang={lang}
                    fullScreen={fullScreen}
                    singlePage={singlePage}
                    onChangeLang={onChangeLang}
                    vcsUrl={vcsUrl as string}
                    vcsType={vcsType as Vcs}
                    isLiked={isLiked}
                    isDisliked={isDisliked}
                    dislikeVariants={dislikeVariants}
                    showEditControl
                    onChangeFullScreen={onChangeFullScreen}
                    onChangeSinglePage={onChangeSinglePage}
                    onSendFeedback={onSendFeedback}
                />
            </div>
        </div>
    );
};

export default Header;
