try {
  nonExistentFunction();
} catch (err) {
  var b = 20; // 这个 'var' 声明实际上是在 try-catch 外部的 VariableEnvironment 中
  let c = 10
  console.log(b); // 输出 20
}
console.log(b); // 输出 20，因为 'b' 实际上是在外部作用域中声明的
console.log(c);