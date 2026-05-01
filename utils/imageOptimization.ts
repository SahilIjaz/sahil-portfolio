export const optimizeImage = (src, width, height) => {
  return `${src}?w=${width}&h=${height}&q=80`;
};
