import logger from '../logging.js';

// Function to compress the uploaded image using a canvas and convert it to base64 (JPEG)
export function compressImage(file, maxWidth = 600, maxHeight = 600) {
    logger.log('Starting image compression...');
    return new Promise((resolve, reject) => {
        const image = new Image();
        const reader = new FileReader();

        reader.onload = function (event) {
            logger.log('FileReader loaded image.');
            image.src = event.target.result;
        };

        reader.onerror = function (error) {
            logger.error('Error reading file:', error);
            reject('Error reading file: ' + error);
        };

        image.onload = function () {
            logger.log('Image loaded into memory for compression.');
            const canvas = document.createElement('canvas');
            let width = image.width;
            let height = image.height;

            // Maintain aspect ratio while resizing
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            // Set the new width and height of the canvas
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, width, height);

            // Convert the canvas to a base64 string (JPEG format, quality 0.7)
            const base64Image = canvas.toDataURL('image/jpeg', 0.7);  // Force JPEG format
            logger.log('Compression and base64 conversion completed:', base64Image);

            // Resolve with the base64 image string
            resolve(base64Image);
        };

        reader.readAsDataURL(file);
    });
}