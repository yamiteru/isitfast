import { object, string, number, minLength, maxLength, minValue, maxValue, parse } from "valibot";

const valibot_user = object({
  name: string(),
  password: string([minLength(8), maxLength(16)]),
  age: number([minValue(0), maxValue(150)]),
});

export const $valibot = {
  $default: 0 || 0,
  $generator: function() {
    return {
      name: "Yamiteru",
      password: "Test123456",
      age: 26
    };
  },
  $function: function(value, blackbox) {
    blackbox(parse(valibot_user, value));
  }
};
