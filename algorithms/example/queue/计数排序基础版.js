const Queue  = require("./index");


let list = [];
for (var i = 0; i < 10; ++i) {
  list[i] = Math.floor(Math.floor(Math.random() * 101));
}

//  生成 0-9 的9个队列
const queues = [];
for (var i = 0; i < 10; ++i) {
  queues[i] = new Queue();
}
/**
 * 将数据根据位数进行排序
 * @param {number[]} nums  需要排序的数组
 * @param {Array} queues
 * @param {*} digit  // 当前的位数 【个位 十位 百...】
 * @return  {number[]} 排序后的数据
 */
function distribute(nums, queues, digit) {
  for (let i = 0; i < nums.length; i++) {
    //  个位
    if (digit === 1) {
      queues[nums[i] % 10].enqueue(nums[i]);
    } else {
      queues[Math.floor(nums[i] / digit)].enqueue(nums[i]);
    }
  }
}

// 收集某位排序号的数字
function collect(queues, nums) {
  let i = 0;
  for (let digit = 0; digit < 10; digit++) {
    while (!queues[digit].empty()) {
      nums[i++] = queues[digit].dequeue();
    }
  }
}

const temList = [92, 9, 38 ,41 ,73, 99, 62, 42, 23, 18]

console.log("排序前", temList.join(" "));
distribute(temList, queues, 1);
collect(queues, temList);
distribute(temList, queues, 10);
collect(queues, list);
console.log("排序后", list.join(" "));

