// // 原型
// function Foo() {}
// const foo = new Foo();

// console.log(foo.__proto__ === Foo.prototype); // true

// console.log(foo.__proto__.constructor === Foo); // true
// console.log(Foo.prototype.constructor === Foo); // true

// console.log(Foo.prototype.__proto__ === Object.prototype); // true

// console.log(Object.prototype.__proto__ === null); // true

// // Foo都是继承函数的Function
// console.log(Foo.__proto__ === Function.prototype); // true

// console.log(Function.__proto__ === Function.prototype); // true


// // Object 函数 是由 Function 构造出来的
// // function Object() { [native code] }
// console.log(Object.__proto__ === Function.prototype); // true

// // Function.prototype.__proto__ 它是个对象， 所以它的__proto__指向Object.prototype
// console.log(Function.prototype.__proto__ === Object.prototype); // true


// console.log(foo.__proto__ === Foo.prototype)
// console.log(Foo.prototype.__proto__ === Object.prototype)


// console.log(Object.getPrototypeOf(foo) === Foo.prototype)
// console.log(Object.getPrototypeOf(foo) === foo.__proto__)








// const value = 1
// function fn() {
//   console.log(value)
// }

// function bar() {
//   const value = 2
//   fn()
// }
// bar()



// console.log(x); // function
 
// var x = 10;
// console.log(x); // 10
 
// x = 20;
 
// function x() {};
 
// console.log(x);

// console.log(a); // undefined
// console.log(b); // "b" is not defined
 
// b = 10;
// var a = 20;


function fn1() {
  console.log(a);
  a = 1
}

fn1()

function fn2() {
  a = 2
  console.log(a);
 
}

fn2()


function fn3() {
  console.log(a);
  a = 3
}

fn3()

