
Function.prototype.myCall = function (context, ...args) {
  if(typeof this !== 'function')  {
    throw new TypeError('this is not a function')
  }
  if(context === null || context === undefined) return this(...args);
  const fn =this;
  // 把基本类型包装成对象
  if(typeof context !== 'object') context = new Object(context);
  context.fn = fn;
  const result = context.fn(...args);
  delete context.fn;
  return result;
}



function fn(...args) {
  console.log(this.result, ...args)
}

fn.myCall({result:"success"},1,2,3,4,5)

fn.call({result:"success"},1,2,3,4,5)