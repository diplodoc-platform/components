import ArrowLeftIcon from '@gravity-ui/icons/svgs/chevron-left.svg';
import CloseIcon from '@gravity-ui/icons/svgs/xmark.svg';
import {Icon} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React, {memo} from 'react';
import {useHotkeys} from 'react-hotkeys-hook';

import {useTranslation} from '../../hooks';
import {Control} from '../Control';

import './SearchBar.scss';

const b = block('dc-search-bar');

export interface SearchBarProps {
    searchQuery?: string;
    onClickPrevSearch?: () => void;
    onClickNextSearch?: () => void;
    onCloseSearchBar?: () => void;
    searchCurrentIndex?: number;
    searchCountResults?: number;
}

const noop = () => {};

const SearchBar = memo<SearchBarProps>((props) => {
    const {t} = useTranslation('search-bar');
    const {
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

    return (
        <div className={b()}>
            <div className={b('left')}>
                <div className={b('navigation')}>
                    <Control
                        onClick={onClickPrevSearch}
                        tooltipText={`${t('prev')} (${hotkeysPrev})`}
                        icon={(args) => <Icon data={ArrowLeftIcon} {...args} />}
                    />
                    <span className={b('counter')}>
                        {searchCurrentIndex}/{searchCountResults}
                    </span>
                    <Control
                        onClick={onClickNextSearch}
                        tooltipText={`${t('next')} (${hotkeysNext})`}
                        icon={(args) => (
                            <Icon data={ArrowLeftIcon} className={b('next-arrow')} {...args} />
                        )}
                    />
                </div>
                <span className={b('search-query-label')}>
                    {t<string>('search-query-label')}:&nbsp;
                </span>
                <span className={b('search-query')}>{searchQuery}</span>
            </div>
            <div className={b('right')}>
                <Control
                    onClick={onCloseSearchBar}
                    tooltipText={t('close')}
                    icon={() => <Icon data={CloseIcon} size={16} />}
                />
            </div>
        </div>
    );
});

SearchBar.displayName = 'DCSearchBar';

export default SearchBar;
