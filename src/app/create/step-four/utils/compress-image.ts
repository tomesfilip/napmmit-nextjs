export const compressImage = async (
  file: File,
  maxWidth = 1920,
  quality = 0.75,
): Promise<File> => {
  const imageBitmap = await createImageBitmap(file);

  const scale = Math.min(1, maxWidth / imageBitmap.width);
  const width = imageBitmap.width * scale;
  const height = imageBitmap.height * scale;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  ctx.drawImage(imageBitmap, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', quality),
  );

  return new File([blob], file.name, {
    type: 'image/jpeg',
  });
};
