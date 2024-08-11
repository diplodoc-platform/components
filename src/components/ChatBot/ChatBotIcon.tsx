import React from 'react';

interface IChatBotIcon {
    handleHover: (value: boolean) => void;
    handleClick: (updater: (value: boolean) => boolean) => void;
    isHovered: boolean;
    className?: string;
}

const ChatBotIcon: React.FC<IChatBotIcon> = ({handleClick, handleHover, isHovered, className}) => {
    return (
        <svg
            onClick={() => handleClick((value) => !value)}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
            width="36"
            height="33"
            viewBox="0 0 36 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M35 29C35 30.6569 33.6569 32 32 32L14 32C6.8203 32 1 26.1797 1 19V14C1 6.8203 6.8203 1 14 1H22C29.1797 1 35 6.8203 35 14L35 29Z"
                fill={isHovered ? 'rgba(191, 175, 205, 1)' : 'white'}
                stroke={isHovered ? 'rgba(191, 175, 205, 1)' : 'white'}
                strokeWidth="2"
            />
            <g clipPath="url(#clip0_2160_4596)">
                <path
                    d="M28 23.875C28 22.7014 27.0486 21.75 25.875 21.75C24.7014 21.75 23.75 22.7014 23.75 23.875C23.75 25.0486 24.7014 26 25.875 26C27.0486 26 28 25.0486 28 23.875Z"
                    fill={isHovered ? 'white' : '#79529D'}
                />
                <path
                    d="M23.75 15.375C23.75 11.8542 20.8958 9 17.375 9C13.8542 9 11 11.8542 11 15.375C11 18.8958 13.8542 21.75 17.375 21.75C20.8958 21.75 23.75 18.8958 23.75 15.375Z"
                    fill={isHovered ? 'white' : '#79529D'}
                />
            </g>
            <defs>
                <clipPath id="clip0_2160_4596">
                    <rect width="17" height="17" fill="white" transform="translate(11 9)" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default ChatBotIcon;
