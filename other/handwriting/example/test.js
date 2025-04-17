class EventCommon {
  constructor(element) {
    if (!element) {
      throw new Error("element is required");
    }
    this.element = element;
  }

  addEvent(type, handler) {
    if (this.element.addEventListener) {
      this.element.addEventListener(type, handler, false);
    } else if (this.element.attachEvent) {
      this.element.attachEvent("on" + type, handler);
    } else {
      this.element["on" + type] = handler;
    }
  }

  removeEvent(type, handler) {
    if (this.element.removeEventListener) {
      this.element.removeEventListener(type, handler, false);
    } else if (this.element.detachEvent) {
      this.element.detachEvent("on" + type, handler);
    } else {
      this.element["on" + type] = null;
    }
  }

  preventDefault(e) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }

  stopPropagation(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }
}

function deepClone(obj, weekMap = new WeakMap()) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }
  if (typeof obj === "function") {
    return obj;
  }
  if (weekMap.has(obj)) {
    return weekMap.get(obj);
  }
  const clone = new obj.constructor();
  weekMap.set(obj, clone);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], weekMap);
    }
  }
  return clone;
}
