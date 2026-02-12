// Analytics tracking utility

let sessionId: string | null = null;

// Get or create session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  if (!sessionId) {
    // Try to get from sessionStorage
    const stored = sessionStorage.getItem('analytics_session_id');
    if (stored) {
      sessionId = stored;
    } else {
      // Generate new session ID
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
  }
  
  return sessionId;
}

interface TrackEventParams {
  eventType: string;
  propertyId?: number | string;
  elementId?: string;
  elementType?: string;
  url?: string;
  metadata?: Record<string, any>;
}

export async function trackEvent(params: TrackEventParams): Promise<void> {
  try {
    const sessionId = getSessionId();
    
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        sessionId,
        url: typeof window !== 'undefined' ? window.location.href : params.url,
      }),
    });
  } catch (error) {
    // Silently fail - analytics should not break the app
    console.error('Analytics tracking failed:', error);
  }
}

// Convenience functions
export const analytics = {
  trackPropertyView: (propertyId: number | string) => {
    trackEvent({
      eventType: 'property_view',
      propertyId,
    });
  },
  
  trackPropertyClick: (propertyId: number | string, elementType: string = 'card') => {
    trackEvent({
      eventType: 'click_property',
      propertyId,
      elementType,
    });
  },
  
  trackPhoneClick: (propertyId?: number | string) => {
    trackEvent({
      eventType: 'click_phone',
      propertyId,
      elementType: 'button',
      elementId: 'phone-button',
    });
  },
  
  trackEmailClick: (propertyId?: number | string) => {
    trackEvent({
      eventType: 'click_email',
      propertyId,
      elementType: 'link',
      elementId: 'email-link',
    });
  },
  
  trackWhatsAppClick: (propertyId?: number | string) => {
    trackEvent({
      eventType: 'click_whatsapp',
      propertyId,
      elementType: 'button',
      elementId: 'whatsapp-button',
    });
  },
  
  trackContactForm: (propertyId?: number | string) => {
    trackEvent({
      eventType: 'contact_form',
      propertyId,
      elementType: 'form',
      elementId: 'contact-form',
    });
  },
  
  trackButtonClick: (buttonId: string, propertyId?: number | string) => {
    trackEvent({
      eventType: 'click_button',
      propertyId,
      elementType: 'button',
      elementId: buttonId,
    });
  },
};

