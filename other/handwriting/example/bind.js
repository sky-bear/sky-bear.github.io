Function.prototype.MyBind = function (context, ...args) {
  if(typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
  }
  const self = this
 function Fn(){}
 const _bind = function(...args2) {
     // 判断当前是否当作构造函数使用
    // 这里的this 指向的是创建的实例
    return self.apply(this instanceof Fn ? this : context, args.concat(args2))
 }
 Fn.prototype = this.prototype;
 _bind.prototype = new Fn()
 return _bind
}




// 定义一个函数fn，参数为不定数量参数args
function fn(...args) {
  console.log(this, ...args)
}

const fnBind = fn.bind(null, 1, 2, 3)
fnBind()