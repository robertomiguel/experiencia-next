// deviceDetection.ts
export const isMobile = /Mobi|Android/i.test(
  typeof navigator !== "undefined" ? navigator.userAgent : ""
);