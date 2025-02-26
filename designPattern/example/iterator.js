// Iterator 迭代器

const getter = function (obj, key) {
  function isObject(obj) {
    return typeof obj === "object" && obj !== null;
  }
  if (!isObject(obj)) {
    return undefined;
  }
  const keys = key.split(".");
  let result = obj;
  for (let i = 0; i < keys.length; i++) {
    if (result[keys[i]] !== undefined) {
      result = result[keys[i]];
    } else {
      return undefined;
    }
  }
  return result;
};

const obj = {
  a: {
    b: {
      c: 1,
    },
  },
};

console.log(getter(obj, "a.b.c"));
