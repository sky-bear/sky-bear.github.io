function deepClone(obj, map = new WeakMap()) {
  if (!obj) return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (typeof obj !== "object") return obj; // 函数或者基础类型
  if(map.has(obj)) return map.get(obj);
  const cloneObj = new obj.constructor();
  map.set(obj, cloneObj);
  for (const key in obj) {
    if(Object.prototype.hasOwnProperty.call(obj,key)) {
      cloneObj[key] = deepClone(obj[key], map);
    }
  }
  return cloneObj;
}
