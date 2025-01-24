function upperCase(strings, ...values) {
  console.log("strings", strings)
  console.log("values", values)
  let result = '';
  strings.forEach((str, i) => {
    if (i > 0) {
      result += String(values[i - 1]).toUpperCase();
    }
    result += str;
  });
  return result;
}

const name = 'rocky';
const age = 18;
const str = upperCase`my name is ${name}, i'm ${age} years old.`;
console.log(str);