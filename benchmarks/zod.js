import { object, string, number } from "zod";

const zod_user = object({
  name: string(),
  password: string().min(8).max(16),
  age: number().min(0).max(150)
});

export const $zod = {
  $generator: function() {
    return {
      name: "Yamiteru",
      password: "Test123456",
      age: 26
    };
  },
  $function: function(value, blackbox) {
    blackbox(zod_user.parse(value));
  }
};
