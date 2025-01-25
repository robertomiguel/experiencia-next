export const objectTrim = (obj: any) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = typeof obj[key] === "string" ? obj[key].trim() : obj[key];
    return acc;
  }, {} as any);
};
