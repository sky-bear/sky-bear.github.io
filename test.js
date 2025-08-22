// async function async1 () {
//     await new Promise((resolve, reject) => {
//         resolve()
//     })
//     console.log('A')
// }

// async1()

// new Promise((resolve) => {
//     console.log('B')
//     resolve()
// }).then(() => {
//     console.log('C')
// }).then(() => {
//     console.log('D')
// })



// async function async1 () {
//     await async2()
//     console.log('A')
// }

// async function async2 () {
//     return new Promise((resolve, reject) => {
//         resolve()
//     })
// }

// async1()

// new Promise((resolve) => {
//     console.log('B')
//     resolve()
// }).then(() => {
//     console.log('C')
// }).then(() => {
//     console.log('D')
// })



// 5  1 3  4 7 11    AAA 8 9 10  6



// async function testA () {
//     return 1;
// }
// async function testA () {
//     return {
//         then (cb) {
//             cb();
//         }
//     };
// }


// function testAA() {
//   return Promise.then()
// }
// function testB() {
//   return Promise.resolve(11)
// }


// testA().then(() => console.log(1));
// testB().then(() => console.log(111));



// Promise.resolve()
//     .then(() => console.log(2))
//     .then(() => console.log(3));



async function test () {
    console.log(1);
    await new Promise((resolve, reject) => {
        resolve()
    })
    console.log(2);
}

test();
console.log(3);

Promise.resolve()
    .then(() => console.log(4))
    .then(() => console.log(5))
    .then(() => console.log(6))
    .then(() => console.log(7));