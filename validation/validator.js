// src/assertions/and2/index.ts
var and2 = (assertion1, assertion2) => (v) => {
  assertion1(v);
  assertion2(v);
};

// src/error.ts
var error = (assertion) => {
  throw assertion;
};

// src/assertions/isArray/index.ts
var isArray = (v) => Array.isArray(v) || error(isArray);

// src/assertions/array/index.ts
var array = (assertion) => (v) => {
  isArray(v);
  for (let i = 0; i < v.length; ++i) {
    assertion(v[i]);
  }
};

// src/assertions/type/index.ts
var type = (input) => (v) => typeof v === input || error(type);

// src/assertions/regex/index.ts
var regex = (pattern) => (v) => pattern.test(v) || error(regex);

// src/assertions/email/index.ts
var email = regex(/^\w+@.+\..+$/);

// src/assertions/isObject/index.ts
var isObject = (v) => v !== null && typeof v === "object" || error(isObject);

// src/assertions/lazy/index.ts
var lazy = (assertion) => (input) => {
  assertion(input)(input);
};

// src/assertions/minLength/index.ts
var minLength = (length) => (v) => v.length >= length || error(minLength);

// src/assertions/minValue/index.ts
var minValue = (input) => (v) => v >= input || error(minValue);

// src/assertions/number/index.ts
var number = type("number");

// src/assertions/object/index.ts
var object = (schema) => {
  const keys = Object.keys(schema);
  return (v) => {
    isObject(v);
    for (let i = 0; i < keys.length; ++i) {
      schema[keys[i]](v[keys[i]]);
    }
  };
};

// src/assertions/string/index.ts
var string = type("string");

const user = object({
  email: and2(string, email),
  name: object({
    first: and2(string, minLength(1)),
    last: and2(string, minLength(1))
  }),
  age: and2(number, minValue(18)),
  friends: array(lazy(() => user)),
});

export const $main = {
  $default: undefined,
  $generator: function() {
    return {
      email: "one@test.com",
      name: {
        first: "John",
        last: "Doe"
      },
      age: 20,
      friends: [
        {
          email: "two@test.com",
          name: {
            first: "Jane",
            last: "Loe"
          },
          age: 21,
          friends: []
        },
        {
          email: "three@test.com",
          name: {
            first: "Mary",
            last: "Foe"
          },
          age: 22,
          friends: []
        }
      ]
    };
  },
  $function: function(value, blackbox) {
    blackbox(user(value));
  }
};
