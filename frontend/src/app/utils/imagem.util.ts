/** Abre o seletor de arquivo e devolve o arquivo escolhido. */
export function pickImageFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });
}

/**
 * Lê o arquivo, redimensiona para caber em `maxSize` (maior lado)
 * e devolve como data URL base64 (JPEG).
 * Reduzir evita estourar o banco.
 */
export function fileToBase64Resized(
  file: File,
  maxSize = 900,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Imagem inválida'));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/** Diz se o valor é uma imagem já armazenada (base64) ou uma URL http(s). */
export function isImageDataUrl(v?: string | null): boolean {
  return !!v && v.startsWith('data:image/');
}