// Track contact button clicks (WhatsApp / Phone)
export async function trackClick(
  clickType: 'whatsapp' | 'phone',
  sourceLabel?: string
) {
  console.log('Track click called:', clickType, sourceLabel);
  
  try {
    // Detect device type
    const userAgent = navigator.userAgent;
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    
    if (/Mobile|Android|iPhone/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/Tablet|iPad/i.test(userAgent)) {
      deviceType = 'tablet';
    }

    const response = await fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clickType,
        sourcePage: window.location.pathname,
        sourceLabel: sourceLabel || `${clickType === 'whatsapp' ? 'WhatsApp' : 'Phone'} Button`,
        deviceType,
        referrer: document.referrer || null,
      }),
    });
    
    console.log('Track response:', await response.json());
  } catch (error) {
    // Silently fail - don't interrupt user experience
    console.error('Track click error:', error);
  }
}
