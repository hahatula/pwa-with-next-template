import React from 'react';

export default function AdvancedIcon({ color = 'var(--accent)' }: { color?: string }, width: number = 18, height: number = 18) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: width, height: height }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_317_55)">
                    <rect x="23.5" y="0.5" width="5" height="23" rx="1.5" transform="rotate(90 23.5 0.5)" fill={color} stroke={color} />
                    <rect x="23.5" y="9.5" width="5" height="23" rx="1.5" transform="rotate(90 23.5 9.5)" fill={color} stroke={color} />
                    <rect x="23.5" y="18.5" width="5" height="23" rx="1.5" transform="rotate(90 23.5 18.5)" fill={color} stroke={color} />
                </g>
                <defs>
                    <clipPath id="clip0_317_55">
                        <rect width="24" height="24" fill="white" transform="translate(24) rotate(90)" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
}