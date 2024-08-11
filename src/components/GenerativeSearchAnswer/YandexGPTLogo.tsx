import React from 'react';

interface IYandexGPTLogo {
    className?: string;
    width?: number;
    height?: number;
    fill?: string;
}

export const YandexGPTLogo: React.FC<IYandexGPTLogo> = ({
    className,
    width = '10',
    height = '11',
    fill = 'black',
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 10 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M10 9.25C10 8.55964 9.44036 8 8.75 8C8.05964 8 7.5 8.55964 7.5 9.25C7.5 9.94036 8.05964 10.5 8.75 10.5C9.44036 10.5 10 9.94036 10 9.25Z"
                fill={fill}
            />
            <path
                d="M7.5 4.25C7.5 2.17893 5.82107 0.5 3.75 0.5C1.67893 0.5 0 2.17893 0 4.25C0 6.32107 1.67893 8 3.75 8C5.82107 8 7.5 6.32107 7.5 4.25Z"
                fill={fill}
            />
        </svg>
    );
};
