export const $main = {
  $default: null,
  $generator: function() {
    return {
      name: "yamiteru",
      age: Math.round(Math.random() * 100),
      grades: new Array(10).map(() => Math.round(Math.random() * 100))
    };
  },
  $function: function(value) {
    JSON.stringify(value);
  }
};
