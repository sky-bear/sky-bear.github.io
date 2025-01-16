
// Function.prototype.myCall = function (context, ...args) {
//   if(typeof this !== 'function') throw new TypeError('Error')
//   if(context === undefined || context === null)  return this(...args)
//   if(typeof context !== 'object') context =  Object(context)
//   context.fn = this
//   const result = context.fn(...args)
//   delete context.fn
//   return result
// }

// Function.prototype.myApply = function (context, args) {
//   if(typeof this !== 'function') throw new TypeError('Error')
//   if(context === undefined || context === null)  return this(...args)
//   if(typeof context !== 'object') context =  Object(context)
//   context.fn = this
//   const result = context.fn(...args)
//   delete context.fn
//   return result
// }

// Function.prototype.myBind = function (context, ...args) {
//   if(typeof this !== 'function') throw new TypeError('Error')
//   if(context === undefined || context === null)  return this(...args)
//   if(typeof context !== 'object') context =  Object(context)
//   const self = this;
//   function fn(){}
//   const _bind = function (...args2) {
//     self.myApply(this instanceof fn ? this : context, [...args, ...args2])
//   }
//   fn.prototype = this.prototype
//   _bind.prototype = new fn()
    
//   return _bind
// }


function foo() {
  console.log(arguments)
}

foo(1,2,3)