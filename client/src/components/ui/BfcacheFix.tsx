'use client';

import { useEffect } from 'react';

/**
 * Fixes the black screen issue when using browser back/forward buttons.
 * 
 * Problem: When the browser restores a page from bfcache (back-forward cache),
 * Next.js client-side state is stale and Framer Motion animations don't re-trigger,
 * resulting in invisible (opacity: 0) content.
 * 
 * Solution: Listen for the `pageshow` event. If the page was restored from bfcache
 * (`event.persisted === true`), force a full page reload to re-initialize everything.
 * 
 * This is the standard approach used by production websites (Twitter, Airbnb, etc.)
 */
export default function BfcacheFix() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from bfcache — force full reload
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  return null;
}
