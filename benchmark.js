const random = () => Math.random();
const unused = "hello";
const array = [...new Array(1_000)].map(random);

const $forEach = () => {
  array.forEach((v) => v + 1);
};

const $forOf = () => {
  for(const v of array) {
    v + 1;
  }
};

let anotherUnused = () => {};

const $while = () => {
  let i = -1;
  while(++i < array.length) {
    array[i] + 1;
  }
};

const $for = () => {
  for(let i = 0; i < array.length; ++i) {
    array[i] + 1;
  }
};

const $empty = () => {};

const wowLookAtMeImUseless = 1;
