// function reverseNumber(num) {
//   if (!num) return num;
//   let str = "";
//   for (let i = `${num}`.length - 1; i >= 0; i--) {
//     str += num[i];
//   }
//   return str;
// }

function reverseNumber(num) {
  if (!num) return num;
  let reverse = 0;
  while (num) {
    let digit = num % 10;
    reverse = reverse * 10 + digit;
    num = Math.floor(num / 10);
  }
  return reverse;
}

console.log(reverseNumber(123)); // 321
