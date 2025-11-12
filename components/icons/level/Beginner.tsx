import React from 'react';

export default function BeginnerIcon({ color = 'var(--accent)' }: { color?: string }, width: number = 18, height: number = 18) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: width, height: height }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_199_31)">
                    <rect x="0.5" y="12.5" width="4" height="11" rx="2" fill={color} stroke={color} />
                    <rect x="10" y="6.5" width="4" height="17" rx="2" stroke={color} />
                    <rect x="19.5" y="0.5" width="4" height="23" rx="2" stroke={color} />
                </g>
                <defs>
                    <clipPath id="clip0_199_31">
                        <rect width="24" height="24" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
}