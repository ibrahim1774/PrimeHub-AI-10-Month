
/**
 * Compresses a base64 image string using Canvas.
 * Reduces dimensions to max 1200px and quality to 0.8.
 */
export const compressImage = async (base64Str: string, maxWidth = 1200, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Convert back to base64 with compression
            // We use image/jpeg for better compression than png
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
        };
        img.onerror = (err) => {
            reject(err);
        };
    });
};
