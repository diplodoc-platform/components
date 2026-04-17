import type {SearchSuggestActionItem} from './types';

import React, {useMemo} from 'react';
import {Text} from '@gravity-ui/uikit';

import {useTranslation} from '../../hooks';

import {SuggestItemType} from './types';
import {AiIcon} from './AiIcon';

interface AiActionItemProps {
    query: string;
    onAiAction: ((query: string) => void) | undefined;
}

const ENTER_HINT = (
    <Text variant="body-short" color="secondary">
        ENTER
    </Text>
);

export function useAiActionItem({
    query,
    onAiAction,
}: AiActionItemProps): SearchSuggestActionItem | null {
    const {t} = useTranslation('search-suggest');

    return useMemo(() => {
        if (!onAiAction || !query) {
            return null;
        }

        return {
            type: SuggestItemType.Action,
            title: t('search-suggest_ask-ai'),
            icon: <AiIcon />,
            hint: ENTER_HINT,
            onClick: () => onAiAction(query),
        };
    }, [onAiAction, query, t]);
}
