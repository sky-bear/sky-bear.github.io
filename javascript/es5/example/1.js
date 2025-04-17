
var obj = {};

Object.defineProperty(obj, 'x', {
  value: 123,
  enumerable: false
});

console.log(JSON.stringify(obj)); // 123