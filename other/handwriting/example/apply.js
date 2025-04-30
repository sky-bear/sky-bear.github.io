Function.prototype.MyApply = function (context, args) {
  // 1.判断调用对象是否为函数
  if (typeof this !== 'function') {
    throw new TypeError(this + 'is not a function')
  }
  if(typeof context === 'undefined' || context === null)  return this(args)
      // 把基本类型包装成对象
  if(typeof context !== 'object') context = new Object(context);
  const fn = this;
  context.fn = this;
  const result = context.fn(...args);
  delete context.fn;
  return result
}




// 定义一个函数fn，参数为不定数量参数args
function fn(...args) {
  console.log(this.result, ...args)
}

fn.MyApply({result:"success"},[1,2,3,4,5])

fn.apply({result:"success"},[1,2,3,4,5])