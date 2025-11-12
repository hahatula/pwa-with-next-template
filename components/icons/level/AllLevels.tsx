import React from 'react';

export default function AllLevelsIcon({ color = 'var(--accent)' }: { color?: string }, width: number = 18, height: number = 18) {
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: width, height: height }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_199_36)">
                    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="4" />
                </g>
                <defs>
                    <clipPath id="clip0_199_36">
                        <rect width="24" height="24" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
}