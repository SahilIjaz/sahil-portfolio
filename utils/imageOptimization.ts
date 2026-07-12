export const optimizeImage = (src: string, width: number, height: number): string => {
  return `${src}?w=${width}&h=${height}&q=80`;
};
