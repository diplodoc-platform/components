import React from 'react';
import block from 'bem-cn-lite';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';
import {useHotkeys} from 'react-hotkeys-hook';

import {Control} from '../Control';

import {Lang} from '../../models';
import CloseIcon from '../../../assets/icons/close.svg';
import ArrowIcon from '../../../assets/icons/search-bar-arrow.svg';

import './SearchBar.scss';

const b = block('dc-search-bar');

export interface SearchBarProps {
    lang: Lang;
    searchQuery?: string;
    onClickPrevSearch?: () => void;
    onClickNextSearch?: () => void;
    onCloseSearchBar?: () => void;
    searchCurrentIndex?: number;
    searchCountResults?: number;
}

type SearchBarInnerProps = SearchBarProps & WithTranslation & WithTranslationProps;

const noop = () => {};

const SearchBar: React.FC<SearchBarInnerProps> = (props) => {
    const {
        t,
        i18n,
        lang,
        searchQuery,
        searchCurrentIndex,
        searchCountResults,
        onClickPrevSearch = noop,
        onClickNextSearch = noop,
        onCloseSearchBar = noop,
    } = props;

    const hotkeysOptions = {filterPreventDefault: true};
    const hotkeysPrev = '⇧+enter';
    const hotkeysNext = 'enter';
    useHotkeys(hotkeysPrev, onClickPrevSearch, hotkeysOptions, [onClickPrevSearch]);
    useHotkeys(hotkeysNext, onClickNextSearch, hotkeysOptions, [onClickNextSearch]);

    if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
    }

    return (
        <div className={b()}>
            <div className={b('left')}>
                <div className={b('navigation')}>
                    <Control
                        onClick={onClickPrevSearch}
                        tooltipText={`${t('prev')} (${hotkeysPrev})`}
                        icon={(args) => <ArrowIcon {...args} />}
                    />
                    <span className={b('counter')}>
                        {searchCurrentIndex}/{searchCountResults}
                    </span>
                    <Control
                        onClick={onClickNextSearch}
                        tooltipText={`${t('next')} (${hotkeysNext})`}
                        icon={(args) => <ArrowIcon {...args} className={b('next-arrow')} />}
                    />
                </div>
                <span className={b('search-query-label')}>{t('search-query-label')}:&nbsp;</span>
                <span className={b('search-query')}>{searchQuery}</span>
            </div>
            <div className={b('right')}>
                <Control
                    onClick={onCloseSearchBar}
                    tooltipText={t('close')}
                    icon={() => <CloseIcon width="10" height="10" />}
                />
            </div>
        </div>
    );
};

SearchBar.displayName = 'DCSearchBar';

export default withTranslation('search-bar')(SearchBar);
