// var b = 10;
// (function b() {
//   b = 20;
//   console.log(b);
// })();
// var b = 10;
// (function () {
//   b = 20;
//   console.log(b);
//   20;
// })();

// var b = 10;
// (function () {
//   console.log(b);
//    b = 20;
// })();



var a = {n: 1};
var b = a;a.x = a = {n: 2};
console.log(a.x)
console.log(b.x)



function MyNew () {
  var obj = {};
  var constructor = [].shift.call(arguments);
  obj.__proto__ = constructor.prototype;
  var ret = constructor.apply(obj, arguments);  
  return typeof ret === 'object' && ret !== null ? ret : obj;
}