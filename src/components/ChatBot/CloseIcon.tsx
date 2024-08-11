import React from 'react';

interface ICloseIcon {
    classname?: string;
}

const CloseIcon: React.FC<ICloseIcon> = () => {
    return (
        <svg
            width="36"
            height="33"
            viewBox="0 0 36 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M35 19C35 26.1797 29.1797 32 22 32L14 32C6.8203 32 1 26.1797 1 19V14C1 6.8203 6.8203 1 14 1L32 1C33.6569 1 35 2.34315 35 4V19Z"
                fill="white"
                stroke="#79529D"
                strokeWidth="2"
            />
            <g clipPath="url(#clip0_2201_3896)">
                <path
                    d="M24.8887 13.727C24.8887 13.6094 24.8422 13.4891 24.752 13.3988C24.5715 13.2184 24.2762 13.2184 24.0957 13.3988L17.9187 19.5758L11.832 13.4891C11.6516 13.3086 11.3562 13.3086 11.1758 13.4891C10.9953 13.6695 10.9953 13.9648 11.1758 14.1453L17.5906 20.5629C17.7711 20.7434 18.0664 20.7434 18.2469 20.5629L24.752 14.0578C24.8449 13.9648 24.8887 13.8473 24.8887 13.727Z"
                    fill="black"
                    stroke="#79529D"
                />
            </g>
            <defs>
                <clipPath id="clip0_2201_3896">
                    <rect width="14" height="14" fill="white" transform="matrix(-1 0 0 -1 25 24)" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default CloseIcon;
