function Fn() {
  console.log(this);
  console.log(this instanceof Fn);
  console.log(this.__proto__ === Fn.prototype); // 等同于 fn.__proto__ === Fn.prototype
}

const fn = new Fn();

var PopFactory = function (name) {
  switch (name) {
    case "alert":
      return new LoginAlert();
    case "confirm":
      return new oginConfirm();
    case "prompt":
      return new LoginPrompt();
  }
};
