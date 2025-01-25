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

interface Shape {}
interface Quare {}
