// 原型
function Foo() {}
const foo = new Foo();

console.log(foo.__proto__ === Foo.prototype); // true

console.log(foo.__proto__.constructor === Foo); // true
console.log(Foo.prototype.constructor === Foo); // true

console.log(Foo.prototype.__proto__ === Object.prototype); // true

console.log(Object.prototype.__proto__ === null); // true

// Foo都是继承函数的Function
console.log(Foo.__proto__ === Function.prototype); // true

console.log(Function.__proto__ === Function.prototype); // true


// Object 函数 是由 Function 构造出来的
// function Object() { [native code] }
console.log(Object.__proto__ === Function.prototype); // true

// Function.prototype.__proto__ 它是个对象， 所以它的__proto__指向Object.prototype
console.log(Function.prototype.__proto__ === Object.prototype); // true


console.log(foo.__proto__ === Foo.prototype)
console.log(Foo.prototype.__proto__ === Object.prototype)


console.log(Object.getPrototypeOf(foo) === Foo.prototype)
console.log(Object.getPrototypeOf(foo) === foo.__proto__)




