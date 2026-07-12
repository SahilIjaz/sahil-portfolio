export const trackEvent = (name: string, data?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    console.log('Event:', name, data);
  }
};
