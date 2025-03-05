import { isString, isNil, isUndefined, isObject } from 'lodash-es';

/**
 * Lấy giá trị từ object thông qua property path.
 *
 * @param obj - Object nguồn
 * @param propertyPath - Đường dẫn thuộc tính (chuỗi) hoặc `undefined`
 * @param defaultValue - Giá trị mặc định trả về nếu không tìm thấy
 * @returns Giá trị chuỗi từ object hoặc defaultValue
 */
const getString = (
  obj: any,
  propertyPath: string | undefined = undefined,
  defaultValue: string | undefined = undefined
): string | undefined => {
  // propertyPath phải là string hoặc undefined
  if (!isUndefined(propertyPath) && !isString(propertyPath)) {
    return undefined;
  }

  if (isNil(obj)) {
    return defaultValue;
  }

  if (isObject(obj) && propertyPath) {
    // Duyệt qua các property theo path
    const result = propertyPath
      .split('.')
      .reduce((prev, curr) => (prev && prev[curr] !== undefined ? prev[curr] : undefined), obj);

    return isString(result) ? result : defaultValue;
  }

  // Nếu obj là string và propertyPath không được cung cấp
  if (isString(obj) && isNil(propertyPath)) {
    return obj;
  }

  return defaultValue;
};

const getNestedValue = (
  obj: any,
  propertyPath: string | undefined = undefined,
  defaultValue: any = undefined
): any => {
  if (!propertyPath || !isString(propertyPath)) {
    return defaultValue;
  }

  try {
    const result = propertyPath.split('.').reduce((prev, key) => {
      if (prev === null || prev === undefined) return undefined;

      // Hỗ trợ index trong mảng, ví dụ: `items[0]`
      const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, arrayKey, index] = arrayMatch;
        return Array.isArray(prev[arrayKey]) ? prev[arrayKey][Number(index)] : undefined;
      }

      return prev[key];
    }, obj);

    return result !== undefined ? result : defaultValue;
  } catch (error) {
    console.error(`Error resolving path: ${propertyPath}`, error);
    return defaultValue;
  }
};

const checkPath = (params: string, pathItem: string): boolean => {
  const segments = params.split('/');
  return segments.includes(pathItem);
};

export { getString, checkPath, getNestedValue };
