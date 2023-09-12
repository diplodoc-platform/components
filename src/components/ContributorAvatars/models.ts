import {Contributor} from '../../models';

export type PopupData = {
    ref: React.MutableRefObject<(HTMLButtonElement & HTMLImageElement) | null>;
    isVisiblePopup: boolean;
    changeVisiblilityPopup: (visible?: boolean) => void;
};

export type AvatarData = {
    contributor: Contributor;
    size?: string;
    inDetails?: boolean;
};

export enum AvatarSizes {
    BIG = 'big',
    SMALL = 'small',
}
