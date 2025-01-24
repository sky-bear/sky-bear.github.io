# 常见知识

<script setup>
import Image from "../../components/Image/index.vue"
</script>

## for of 和 for in 的区别

| 特性             | `for...in`                         | `for...of`                               |
| ---------------- | ---------------------------------- | ---------------------------------------- |
| 遍历对象类型     | 对象（包括数组，但不推荐）         | 可迭代对象（数组、字符串、映射、集合等） |
| 返回的内容       | 属性名（键）                       | 元素值                                   |
| 是否遍历继承属性 | 是（仅限可枚举属性）               | 否                                       |
| 性能考虑         | 可能较慢，尤其是当对象有很多属性时 | 通常更快，因为它直接访问值               |
| 推荐使用场景     | 遍历对象属性                       | 遍历数组或其他可迭代对象的值             |

## 模板字符串

tagged template

```js
function upperCase(strings, ...values) {
  console.log("strings", strings);
  console.log("values", values);
  let result = "";
  strings.forEach((str, i) => {
    if (i > 0) {
      result += String(values[i - 1]).toUpperCase();
    }
    result += str;
  });
  return result;
}

const name = "rocky";
const age = 18;
const str = upperCase`my name is ${name}, i'm ${age} years old.`;
console.log(str);
```
