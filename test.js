// //
// function MyNew() {
//   const Constructor = Array.prototype.shift.call(arguments);
//   const obj = Object.create(Constructor.prototype)
//  const result =  Constructor.apply(obj, arguments);
//  return typeof result === 'object' && result !== null ? result : obj;
// }

// function mid1(next){
//   console.log("next1")
//   console.log("进入 mid1")
//   next()
//   console.log("结束mid1")
// }

// function mid2(next){
//   console.log("nex2")
//   console.log("进入 mid2")
//   next()
//   console.log("结束mmid2")
// }

//   function mid3(next){
//   console.log("next3")
//   console.log("进入 mid3")
//   next()
//   console.log("结束mid3")
//   }

//   const list =  [mid1,mid2,mid3 ]

//   function compose(list) {
//     return list.reduceRight((a,b) => {
//       return () => b(() => a())
//     }, () => {})
//   }

//   const fn = compose(list)
//   // console.log(fn())

//   function run(list) {
//     let i = 0;
//     function next() {
//       const mid = list[i++];
//       if(!mid) return
//       mid(() => next())
//     }
//     next()

//   }
//   run(list)

var myobject = {
  foo: "bar",
  func: function () {
    var self = this;
    console.log("outer func:this foo =", this.foo);
    console.log("outer func:self. foo =", self.foo);
    (function () {
      console.log("inner func:this.foo =" + this.foo);
      console.log("inner func:self. foo =" + self.foo);
    })();
  },
};

// myobject.func();


function fn() {
  console.log(1);
  (() => console.log(123))()
}
fn()