// function fn(type) {
//   if (type === "a") {
//     return function (...args) {};
//   } else if (type === "b") {
//     return function (...args) {};
//   } else {
//     return function (...args) {};
//   }
// }




function add() {
  const arg = [...arguments];
  const fn = function (num) {
    arg.push(num);
    return fn;
  }
  fn.toString = function () {
    return arg.reduce((a, b) => a + b, 0);
  }
  
  return fn
}

console.log(add(1)(2)(3)(4)+'');