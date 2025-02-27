// 同步模块模式-SMD(Synchronous Module Definition)


const F = {};
F.define = function (str,fn) {
  const parts = str.split('.')
  let old = parent = this
  let i = 0; // 记录当前模块的层级
  // 如果第一个模式是模块管理器单体对象， 则移除
  if(parts[0] === 'F') {
    parts = parts.slice(1)
  }
  // 屏蔽对于define和module的重写
  if(parts[0] === 'define' || parts[0] === 'module') {
    return
  }
  // 模块层级长度
  let len = parts.length
  for(i<len; i++;) {
    if(typeof parent[parts[i]] === 'undefined') {
      parent[parts[i]] = {}
    }
    old = parent
    parent = parent[parts[i]]
  }
  // 如果已经给出了模块定义函数，则调用
  if(fn) {
    // --i 循环完成后 i=len，所以需要减1
    old[parts[--i]] = fn()
  }
  return this
}

F.define('string', function() {
  return {
    a(){console.log("a")}
  }
})
F.define('dom', function() {
  return function(id) {
    console.log(id)
  }
})



F.module = function(){
  const args = Array.prototype.slice.call(arguments)
  // 获取回调函数
  const fn = args.pop()
  // 获取依赖模块
  const parts = args[0] && args[0] instanceof Array ? args[0] : args
  // 依赖模块列表
  const modules = []
  // 模块路由
  let modIds =""
  // 依赖模块长度
  const len = parts.length
  // 依赖模块层级
  let i = 0
  let parent,j ,k;
  while(i < len) {
    if(typeof parts[i] ==="string") {
      parent = this;
      modIds = parts[i].replace(/^F\./,'').split('.');
      for(j = 0,k = modIds.length; j < k; j++) {
        parent = parent[modIds[j]] || false
      }
      modules.push(parent)
    } else {
      modules.push(parts[i])
    }
    i++;
  }
  fn.apply(null,modules)
}

F.string.a()
F.dom(123)

F.module(['string.a', "dom"], function(a,dom) {
  a();
  dom(456)
})