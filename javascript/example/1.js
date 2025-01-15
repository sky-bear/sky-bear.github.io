// Function.prototype.call = function(context, ...args) {
//   // null 和 undefined 不处理
//   if(context === null || context === undefined)  return this(...args);
//   // 基本类型
//   if(typeof context !== 'object') {
//     context =  Object(context)
//   };
//   context.fn = this;
//   const result = context.fn(...args);
//   delete context.fn;
//   return result;
// }



Function.prototype.apply = function(context, args) {
    // null 和 undefined 不处理
  const arrayArgs = Array.isArray(args) ? args : [args]
  if(context === null || context === undefined)  return this(...arrayArgs);
  // 基本类型
  if(typeof context !== 'object') {
    context =  Object(context)
  };
  context.fn = this;
  const result = context.fn(...arrayArgs);
  delete context.fn;
  return result;
}


function fn(a,b,c){
  console.log(this);
}
fn.apply({name: 'test'}, [1,2,3]); // {name: 'test'}
fn.apply(1) // [Number: 1]
fn.apply(null) // undefined
fn.apply(undefined) // undefined
fn.apply(false) // [Boolean: false]