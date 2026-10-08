/**
 * AllTools Global Adsterra Direct Link & Monetization Manager
 * Triggers Direct Link / Adsterra Smartlink on download button click
 * with 100% Popup-Blocker Bypass and instant file download execution.
 */

let _activeDirectLink: string | null = null;
let _isDirectLinkEnabled: boolean = true;

// Pre-load from cache immediately
try {
  const cached = localStorage.getItem('cached_ads_config') || localStorage.getItem('admin_ads_config');
  if (cached) {
    const parsed = JSON.parse(cached);
    _activeDirectLink = parsed?.directLinkUrl || parsed?.downloadAd?.url || null;
    _isDirectLinkEnabled = parsed?.downloadAd?.enabled ?? (_activeDirectLink ? true : false);
  }
} catch (_) {}

export const setDirectLinkConfig = (url: string, enabled: boolean = true) => {
  _activeDirectLink = url;
  _isDirectLinkEnabled = enabled;
};

export const triggerDownloadAd = (onDownloadCallback: () => void) => {
  // 1. Get latest Direct Link URL
  let targetUrl = _activeDirectLink;
  let isEnabled = _isDirectLinkEnabled;

  try {
    const cached = localStorage.getItem('cached_ads_config') || localStorage.getItem('admin_ads_config');
    if (cached) {
      const parsed = JSON.parse(cached);
      const url = parsed?.directLinkUrl || parsed?.downloadAd?.url;
      if (url) {
        targetUrl = url;
        isEnabled = parsed?.downloadAd?.enabled ?? true;
      }
    }
  } catch (_) {}

  // 2. Open Direct Link in New Tab with Industry-Standard Popup Bypass
  if (targetUrl && targetUrl.trim().length > 0 && isEnabled) {
    try {
      let cleanUrl = targetUrl.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = `https://${cleanUrl}`;
      }

      // Method 1: Clean Anchor element click (Bypasses Browser Popup Blockers)
      const adAnchor = document.createElement('a');
      adAnchor.href = cleanUrl;
      adAnchor.target = '_blank';
      adAnchor.rel = 'noopener noreferrer';
      adAnchor.style.display = 'none';
      document.body.appendChild(adAnchor);
      
      // Dispatch trusted mouse event
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      adAnchor.dispatchEvent(clickEvent);
      
      setTimeout(() => {
        try {
          if (document.body.contains(adAnchor)) {
            document.body.removeChild(adAnchor);
          }
        } catch (_) {}
      }, 100);

    } catch (e) {
      // Method 2: Direct window.open fallback
      try {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } catch (_) {}
    }
  }

  // 3. ALWAYS execute the actual file download immediately on click!
  try {
    onDownloadCallback();
  } catch (err) {
    console.error('File download execution failed:', err);
  }
};
