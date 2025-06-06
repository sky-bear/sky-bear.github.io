const fn1 = () => {
  console.log("fn1", this);
};
fn1()

const obj = {
  fn2() {
    const fn2 = () => {
      console.log("fn2", this);
    };
    fn2();
  },
};

obj.fn2();
const fn3 = obj.fn2;

console.log("fn3---")
fn3();
console.log("fn3---")


const fn4 = () => {
  console.log("fn4", this);
};



const obj2 = {
  fn2() {
    fn4()
  },
};

obj2.fn2();