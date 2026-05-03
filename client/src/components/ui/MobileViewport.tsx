'use client';

import { useEffect } from 'react';

export default function MobileViewport() {
  useEffect(() => {
    if (window.innerWidth <= 768) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=0.8, maximum-scale=5, user-scalable=yes'
        );
      }
    }
  }, []);

  return null;
}
