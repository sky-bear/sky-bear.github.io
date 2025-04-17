console.log(Number(null))
console.log(Number(undefined))



const a = {
  b:{
    c:1
  }
}

const a1 = {
  b:{
    c2:1
  }
}
Object.assign(a,a1)

console.log(a)