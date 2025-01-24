const obj1 = {
  a: 1,
  fn() {
    console.log("this-obj1", this);
  },
};
const obj2 = {
  a: 1,
  fn: () => {
    console.log("this-obj2-fn", this);
  },
  fn2: function () {
    (() => {
      console.log("this-obj2-fn2", this);
    })();
  },
};
const obj3 = {
  a: 2,
  fn(fn) {
    console.log("this---obj3", this);
    fn();
  },
};

obj1.fn();

obj2.fn();

obj2.fn2();

const fn2 = obj2.fn2;

fn2();

obj3.fn(fn2);
