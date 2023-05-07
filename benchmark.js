const array = [...new Array(1_000)].map(() => Math.random());

export const $forEach = () => {
  array.forEach((v) => v + 1);
};

export const $forOf = () => {
  for(const v of array) {
    v + 1;
  }
};

export const $while = () => {
  let i = -1;
  while(++i < array.length) {
    array[i] + 1;
  }
};

export const $for = () => {
  for(let i = 0; i < array.length; ++i) {
    array[i] + 1;
  }
};

export const $empty = () => {};

// const a = [...new Array(1_000)].map(() => Math.random());
// const b = [...new Array(1_000)].map(() => Math.random());
//
// export const $spread = () => {
//   const _ = [ ...a, ...b ];
// };
//
// export const $concat = () => {
//   const _ = a.concat(b);
// };
//
// export const $loop = () => {
//   let _ = [];
//
//   for(let i = 0; i < a.length; ++i) {
//     _.push(a[i]);
//   }
//
//   for(let i = 0; i < b.length; ++i) {
//     _.push(b[i]);
//   }
// };
//
// export const $push = () => {
//   const _ = [].push(...a, ...b);
// };
