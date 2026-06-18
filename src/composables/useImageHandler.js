/**
 * Composable para el manejo de imágenes
 */
export function useImageHandler() {
    /**
     * Comprime una imagen base64
     * @param {string} base64Image - Imagen en formato base64
     * @param {number} maxWidth - Ancho máximo de la imagen
     * @param {number} quality - Calidad de la compresión (0-1)
     * @returns {Promise<string>} - Imagen comprimida en formato base64
     */
    const compressImage = (base64Image, maxWidth = 600, quality = 0.6) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Image;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
  
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
  
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
  
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
      });
    };
  
    /**
     * Procesa un archivo de imagen seleccionado
     * @param {Event} event - Evento del input file
     * @param {Function} onSuccess - Callback con la imagen procesada
     * @param {Function} onError - Callback en caso de error
     * @param {number} maxSize - Tamaño máximo en bytes
     */
    const processImageFile = (event, onSuccess, onError, maxSize = 5000000) => {
      const file = event.target.files[0];
      if (!file) return;
      
      if (file.size > maxSize) {
        onError && onError(`La imagen es demasiado grande. Máximo ${maxSize/1000000}MB`);
        return;
      }
  
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = e.target.result;
        try {
          const compressedImage = await compressImage(base64String);
          onSuccess && onSuccess(compressedImage);
        } catch (error) {
          onError && onError('Error al procesar la imagen');
        }
      };
      reader.readAsDataURL(file);
    };
  
    return {
      compressImage,
      processImageFile
    };
  }