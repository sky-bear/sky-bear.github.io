# 垃圾回收 & 运行机制

<script setup>
import Image from "../../components/Image/index.vue"
</script>

JavaScript 属于解释型语言，它需要在代码执行时，将代码编译为机器语言。<br />
ast（abstract struct tree）
<Image  src="./images/engine.png" />

- Interpreter 逐行读取代码并立即执行。
- Compiler 读取您的整个代码，进行一些优化，然后生成优化后的代码。

```js
function add(a, b) {
  return a + b;
}
for (let i = 0; i < 1000; i++) {
  add(1 + 1);
}
```

上面的示例循环调用了 add 函数 1000 次，该函数将两个数字相加并返回总和。

1. Interpreter 接收上面的代码后，它将逐行读取并立即执行代码，直到循环结束。 它的工作仅仅是实时地将代码转换为我们的计算机可以理解的内容。
2. 如果这段代码受者是 Compiler，它会先完整地读取整个程序，对我们要执行的代码进行分析，并生成电脑可以读懂的机器语言。过程如同获取 X（我们的 JS 文件）并生成 Y（机器语言）一样。如果我们使用 Interpreter 执行 Y，则会获得与执行 X 相同的结果。
   <Image  src="./images/engine_1.png" />
   从上图中可以看出，ByteCode 只是中间码，计算机仍需要对其进行翻译才能执行。 但是 Interpreter 和 Compiler 都将源代码转换为机器语言，它们唯一的区别在于转换的过程不尽相同。

- Interpreter 逐行将源代码转换为等效的机器代码。
- Compiler 在一开始就将所有源代码转换为机器代码。

### 资料引用

<a href="https://y03l2iufsbl.feishu.cn/docx/XnOtdJySUoSHPjxPVAGc6LwgnIc" target="_blank"  style="display: block">垃圾回收 & 运行机制</a>
