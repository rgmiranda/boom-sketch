
/**
 * 
 * @param { string } imageUrl 
 * @returns { Promise<HTMLImageElement> }
 */
export function loadImage(imageUrl) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = imageUrl;
  });
}

