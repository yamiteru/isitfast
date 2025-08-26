import { array, lazy, number, object, string } from "zod";

const user = object({
  email: string().email(),
  name: object({
    first: string().min(1),
    last: string().min(1)
  }),
  age: number().min(18),
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
    blackbox(user.parse(value));
  }
};
