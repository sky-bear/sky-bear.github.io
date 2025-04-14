Function.prototype.MyCall = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  if (context === null || context === undefined) return context(...args);
  if(typeof context !== "object") context = new Object(context);
  const fn = this;
  context.fn = fn;
  const result = context.fn(...args);
  delete context.fn;
  return result;
};


const a = new Object("aaa");







