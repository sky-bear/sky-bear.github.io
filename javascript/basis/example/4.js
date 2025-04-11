// function fn(type) {
//   if (type === "a") {
//     return function (...args) {};
//   } else if (type === "b") {
//     return function (...args) {};
//   } else {
//     return function (...args) {};
//   }
// }




// function add() {
//   const arg = [...arguments];
//   const fn = function (num) {
//     arg.push(num);
//     return fn;
//   }
//   fn.toString = function () {
//     return arg.reduce((a, b) => a + b, 0);
//   }
  
//   return fn
// }

// console.log(add(1)(2)(3)(4)+'');



const obj = {a:1}
const a = Object.seal(obj)
a.b = 2
a.a = 2
console.log(a)