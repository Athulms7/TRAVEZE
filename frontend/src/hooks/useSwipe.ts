import { useState, useEffect } from 'react';

interface SwipeInput {
  element: HTMLElement | null;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export const useSwipe = ({
  element,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50
}: SwipeInput) => {
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [touchEnd, setTouchEnd] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      });
    };

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = touchStart.y - touchEnd.y;
      const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
      
      if (isHorizontalSwipe) {
        if (distanceX > threshold && onSwipeLeft) {
          onSwipeLeft();
        } else if (distanceX < -threshold && onSwipeRight) {
          onSwipeRight();
        }
      } else {
        if (distanceY > threshold && onSwipeUp) {
          onSwipeUp();
        } else if (distanceY < -threshold && onSwipeDown) {
          onSwipeDown();
        }
      }
      
      setTouchEnd(null);
      setTouchStart(null);
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [element, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, touchStart, touchEnd, threshold]);
}; 