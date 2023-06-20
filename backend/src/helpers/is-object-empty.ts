export const isObjectEmpty = (objectName): boolean => {
  return JSON.stringify(objectName) === '{}';
};
