let a
console.log(typeof  a) // undefined
console.log(Object.prototype.toString.call(a)) // [object Undefined]

Object.defineProperty(window, 'a', {
  
})