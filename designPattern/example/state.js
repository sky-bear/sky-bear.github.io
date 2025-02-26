// 状态模式

const fn = (type, data) => {
  const map = {
    a(){},
    b(){},
    c(){}
  }
  map[type] && map[type](data)
}