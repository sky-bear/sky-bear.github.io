function MyInstance(left, right) {
  let _proto = Object.getPrototypeOf(left);
  let _prototype = right.prototype;
  while (true) {
    if (_proto === null) {
      return false;
    }
    if (_proto === _prototype) {
      return true;
    }
    
    _proto = Object.getPrototypeOf(_proto);
  }
}