export const trackEvent = (name, data) => {
  if (typeof window !== 'undefined') {
    console.log('Event:', name, data);
  }
};
