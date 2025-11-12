'use client';

import { useCallback, useRef } from 'react';
import type { TouchEvent } from 'react';

type SwipeOptions = {
    threshold?: number;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
};

export default function useHorizontalSwipe<T extends HTMLElement = HTMLDivElement>({ threshold = 50, onSwipeLeft, onSwipeRight }: SwipeOptions = {}) {
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const handleTouchStart = useCallback((e: TouchEvent<T>) => {
        const touch = e.changedTouches[0];
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
    }, []);

    const handleTouchEnd = useCallback((e: TouchEvent<T>) => {
        if (touchStartX.current == null || touchStartY.current == null) return;
        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStartX.current;
        const dy = touch.clientY - touchStartY.current;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDx > threshold && absDx > absDy) {
            if (dx < 0) {
                onSwipeLeft && onSwipeLeft();
            } else if (dx > 0) {
                onSwipeRight && onSwipeRight();
            }
        }

        touchStartX.current = null;
        touchStartY.current = null;
    }, [threshold, onSwipeLeft, onSwipeRight]);

    return {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
    } as const;
}


