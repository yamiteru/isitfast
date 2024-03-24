const assert = (fn) => (value) => {
	if(fn(value) === false) throw void 0;
};

const rangeValue = (min, max) => assert((v) => v >= min && v <= max);
const rangeLength = (min, max) => assert((v) => v.length >= min && v.length <= max);

const both = (fn1, fn2) => (value) => (fn1(value), fn2(value));

const object = (schema) => {
	const keys = Object.keys(schema);
	const length = keys.length;

	return (value) => {
		for(let i = 0; i < length; ++i) {
			schema[keys[i]](value[keys[i]]);
		}
	};
};

const tString = (v) => assert(typeof v === "string");
const tNumber = (v) => assert(typeof v === "number");

const validator_user = object({
  name: tString,
  password: both(tString, rangeLength(8, 16)),
  age: both(tNumber, rangeValue(0, 150)),
});

export const $validator = {
  $default: 0 || 0,
  $generator: function() {
    return {
      name: "Yamiteru",
      password: "Test123456",
      age: 26
    };
  },
  $function: function(value, blackbox) {
    blackbox(validator_user(value));
  }
};
