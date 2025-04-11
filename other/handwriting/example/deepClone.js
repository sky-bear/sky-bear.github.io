function deepClone(obj, map = new WeakMap){
  if(obj === null) {
    return obj
  }
  if(obj instanceof Date) {
    return new Date(obj)
  }
  if(obj instanceof RegExp) {
    return new RegExp(obj)
  }
  if(typeof obj === "function") {
    return obj
  }
  if(map.has(obj)) {
    return map.get(obj)
  }
  const cloneObj = new obj.constructor()
  map.set(obj, newObj)
  for(let key in obj) {
    if(Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = deepClone(obj[key], map)
    }
  }
  return cloneObj
}
