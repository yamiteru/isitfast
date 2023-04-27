const add = (...numbers) => numbers.reduce((a, b) => a + b, 0);

export default () => add(1, 2);
