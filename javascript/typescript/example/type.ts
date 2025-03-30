function test(a: string, b: number) {
  return {
    a,
    b,
  };
}

type testtype = Parameters<typeof test>;
type testtype2 = ReturnType<typeof test>;

type ParamType<T> = T extends (arg: infer P) => any ? P : T;

interface User {
  name: string;
  age: number;
}

type Func = (user: User) => void;

type Param = ParamType<Func>; // Param = User
type AA = ParamType<string>; // string

interface Shape { }
interface Quare { }


const value1: any = 1;
const value2: unknown = 1;
const value3: boolean = value1
const value4: boolean = value2 // 错误的

const value5: ReadonlyArray<number> = [1, 2, 3, 4];

interface A {
  c: string;
  d: string;
}
interface B {
  c: number;
  e: string;
}
let obj: A & B = {
  d: "1",
  e: "2",
  c: "1"
};


interface Person {
  name: string;
  speak(): void;
}
interface Dog {
  name: string;

}

function isPerson(p: Person | Dog) {
  if("speak" in p) {
  
  }
}


// 定义两个重载签名
function padLeft(value: string, padding: number): string;
function padLeft(value: string, padding: string): string;

// 实现签名
function padLeft(value: string, padding: any): string {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}

console.log(padLeft("Hello World", 4)); // 输出 "    Hello World"
console.log(padLeft("Hello World", "-")); // 输出 "-Hello World"