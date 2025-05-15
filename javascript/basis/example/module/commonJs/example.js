let x = 5;
const obj = {a:1}

function add(a) {
  obj.a += 1;
  return x + a;
}

module.exports.x = x;
module.exports.obj = obj;
module.exports.add = add;