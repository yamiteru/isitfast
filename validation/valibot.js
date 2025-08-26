import { lazy, object, string, number, array, email, minLength, minValue, parse } from "valibot";

const user = object({
  email: string([email()]),
  name: object({
    first: string([minLength(1)]),
    last: string([minLength(1)])
  }),
  age: number([minValue(18)]),
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
    blackbox(parse(user, value));
  }
};
