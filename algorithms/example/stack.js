function Stack() {
  this.dataStore = [];
  this.top = 0;
  this.push = function (ele) {
    this.dataStore[this.top++] = ele;
  };
  this.pop = function () {
    return this.dataStore[--this.top];
  };
  this.peek = function () {
    return this.dataStore[this.top - 1];
  };
  this.clear = function () {
    this.top = 0;
    this.dataStore = [];
  };
  this.length = function () {
    return this.top;
  };
  this.getStack = function () {
    return this.dataStore;
  }
}


function mulBase(num, base) {
  const stack = new Stack();
  while (num > 0) {
    stack.push(num % base);
    num = Math.floor((num / base));
  }
  let converted = "";
  while (stack.length() > 0) {
    converted += stack.pop();
  }
  return converted;
}

console.log(mulBase(4, 2))


