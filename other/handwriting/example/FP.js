function sum() {
  const args = Array.prototype.slice.call(arguments);
  const add = function () {
    args.push(...arguments);
    return add;
  };
  add.toString = function () {
    return args.reduce((a, b) => a + b, 0);
  };
  add.get = function () {
    return args.reduce((a, b) => a + b, 0);
  };
  return add;
}

console.log(sum(1)(2)(3)().get()); // 6
