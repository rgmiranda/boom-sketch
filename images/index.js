
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
 * @param { number } width 
 * @param { number } height 
 * @returns { ImageData }
 */
export function getImageData(image, width = undefined, height = undefined) {
  width = width ?? image.width;
  height = height ?? image.height;

  /** @type { HTMLCanvasElement } */
  const cv = document.createElement('canvas');
  cv.width = width;
  cv.height = height;
  
  /** @type { CanvasRenderingContext2D } */
  const ctx = cv.getContext('2d');
  
  ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
  
  const imageData = ctx.getImageData(0, 0, width, height);
  return imageData;
}

/**
 * 
 * @param { HTMLImageElement } image 
 * @param { number } width 
 * @param { number } height 
 * @returns { Uint8ClampedArray }
 */
export function getImageBrightness(image, width = undefined, height = undefined) {
  let r, g, b;

  width = width ?? image.width;
  height = height ?? image.height;

  /** @type { HTMLCanvasElement } */
  const cv = document.createElement('canvas');
  cv.width = width;
  cv.height = height;
  
  /** @type { CanvasRenderingContext2D } */
  const ctx = cv.getContext('2d');
  
  const lumenWeights = [ 0.2126, 0.7152, 0.0722 ];
  
  ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const imageBrightness = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    r = imageData.data[i + 0] * lumenWeights[0];
    g = imageData.data[i + 1] * lumenWeights[1];
    b = imageData.data[i + 2] * lumenWeights[2];
    imageBrightness.push(r + g + b);
  }
  return imageBrightness;
}

/**
 * 
 * @param { ImageData } imageData 
 * @returns { number[] }
 */
export function getDataBrightness(imageData) {
  let r, g, b;

  const lumenWeights = [ 0.2126, 0.7152, 0.0722 ];
  const imageBrightness = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    r = imageData.data[i + 0] * lumenWeights[0];
    g = imageData.data[i + 1] * lumenWeights[1];
    b = imageData.data[i + 2] * lumenWeights[2];
    imageBrightness.push(r + g + b);
  }
  return imageBrightness;
}

/**
 * @param { string } char
 * @param { string } fontStyle
 * @param { number } width 
 * @param { number } height 
 * @returns { ImageData }
 */
export function getGliphImageData(char, fontStyle, width, height, fg = 'white', bg = 'black') {
  /** @type { TextMetrics } */
  let mtext

  const fontSize = width;

  let mx, my, mw, mh;

  /** @type { HTMLCanvasElement } */
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  /** @type { CanvasRenderingContext2D } */
  const context = canvas.getContext('2d');
  context.fillStyle = bg;
  context.fillRect(0, 0, width, height);

  context.font = `bold ${fontSize}px ${fontStyle}`;
  context.fillStyle = fg;

  mtext = context.measureText(char);
  mw = mtext.width;
  mh = mtext.actualBoundingBoxAscent + mtext.actualBoundingBoxDescent;
  my = (height + mh) * 0.5;
  mx = (width - mw) * 0.5;
  context.fillText(char, mx, my);
  return context.getImageData(0, 0, width, height);
}
