"use client";

import { useEffect } from 'react';

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      // Lock scroll by setting overflow hidden to the body
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup function in case component unmounts while locked
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLocked]);
}
