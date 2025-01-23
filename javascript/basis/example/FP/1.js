var Flock = function(n) {
  this.seagulls = n;
};

Flock.prototype.conjoin = function(other) {
  this.seagulls += other.seagulls;
  return this;
};

Flock.prototype.breed = function(other) {
  this.seagulls = this.seagulls * other.seagulls;
  return this;
};

var flock_a = new Flock(4);
var flock_b = new Flock(2);
var flock_c = new Flock(0);

var result = flock_a.conjoin(flock_c).breed(flock_b).conjoin(flock_a.breed(flock_b)).seagulls;
//                  4   // flock_a 4   8   flock_a 8           16   flock_a 16  


// console.log(result) // 32
// console.log(flock_a.seagulls) // 16




function fn(a,b,c,d,e) {
  console.log(a,b,c,d,e)
}

function curry(fn) {
 const length = fn.length
 const args = []
 const _fn = function() {
  args.push(...arguments)
  if(args.length >= length) {
    const result = fn(...args)
    args.length = 0
    return result
  }
  return _fn
 }
 return _fn
}

let _fn = curry(fn)

_fn(1,2,3)(4)(5)
_fn(1,2,3,4)(5)
_fn(1)(2)(3)(4)(5)
_fn(1,2,3,4,5)