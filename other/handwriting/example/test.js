
Function.prototype.myBind = function (context, ...args) {
  if(typeof this !== 'function') {
    throw new TypeError('Error')
  }
  const self = this
  function Fn(){}
  const _bind = function(...args1) {
    return self.apply(this instanceof Fn ? this : context, args.concat(args1))
  }
  Fn.prototype = this.prototype
  _bind.prototype = new Fn()

  return _bind
}





