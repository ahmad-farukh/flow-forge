export const isImage = (file) => file?.type?.startsWith("image/");
export const maxFileSize = 10 * 1024 * 1024;
export const validFile = (file) => Boolean(file && file.size <= maxFileSize);
