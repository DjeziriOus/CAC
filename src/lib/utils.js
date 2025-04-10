import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
// Helper to compare objects deeply
export const isEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isEqual(obj1[key], obj2[key])) return false;
  }

  return true;
};
export const refreshJwtExpiration = () => {
  const jwtDataStr = localStorage.getItem("jwt");
  if (!jwtDataStr) return; // No JWT found, so nothing to update

  const jwtData = JSON.parse(jwtDataStr);
  // Add 30 minutes (30 * 60 * 1000 milliseconds) to the current time
  jwtData.exp = Date.now() + 30 * 60 * 1000;

  localStorage.setItem("jwt", JSON.stringify(jwtData));
};
export function getExtensionFromDataURL(dataURL) {
  // Extract the MIME type from the data URL
  const mimeMatch = dataURL.match(/data:(.*?);base64/);

  if (!mimeMatch || !mimeMatch[1]) {
    return "bin"; // Default extension if MIME type can't be determined
  }

  const mimeType = mimeMatch[1];

  // Map common MIME types to file extensions
  const mimeToExtension = {
    "application/pdf": "pdf",
    "application/json": "json",
    "application/javascript": "js",
    "application/xml": "xml",
    "application/zip": "zip",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
    "application/msword": "doc",
    "application/vnd.ms-excel": "xls",
    "application/vnd.ms-powerpoint": "ppt",
    "text/plain": "txt",
    "text/html": "html",
    "text/css": "css",
    "text/csv": "csv",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/bmp": "bmp",
    "image/svg+xml": "svg",
    "image/webp": "webp",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/ogg": "ogv",
    "video/quicktime": "mov",
  };

  return mimeToExtension[mimeType] || "bin"; // Return matching extension or default
}
export function dataURLtoFilev2(dataURL, filenameBase) {
  const extension = getExtensionFromDataURL(dataURL);
  const filename = `${filenameBase}.${extension}`;

  // Rest of your file conversion code...
  const [header, base64Data] = dataURL.split(",");
  const mime = header.match(/data:(.*?);base64/)[1];

  // Decode the base64 data
  const binaryData = atob(base64Data);

  // Convert binary data to an array buffer
  const arrayBuffer = new ArrayBuffer(binaryData.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }

  // Create a Blob from the array buffer
  const blob = new Blob([arrayBuffer], { type: mime });

  // Create a File object from the Blob
  return new File([blob], filename, { type: mime });
}
