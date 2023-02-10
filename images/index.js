
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

/**
 * 
 * @param { HTMLImageElement } image 
 * @returns { Uint8ClampedArray }
 */
export function getImageBrightness(image) {
  let r, g, b;

  /** @type { HTMLCanvasElement } */
  const cv = document.createElement('canvas');
  cv.width = image.width;
  cv.height = image.height;

  /** @type { CanvasRenderingContext2D } */
  const ctx = cv.getContext('2d');

  const lumenWeights = [ 0.2126, 0.7152, 0.0722 ];

  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const imageBrightness = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    r = imageData.data[i + 0] * lumenWeights[0];
    g = imageData.data[i + 1] * lumenWeights[1];
    b = imageData.data[i + 2] * lumenWeights[2];
    imageBrightness.push(r + g + b);
  }
  return imageBrightness;
}
