const type = Symbol();

export const error = (
  reason,
  value = undefined,
  context = undefined,
  message = undefined,
) => {
  throw {
    type,
    reason,
    value,
    context,
    message,
  };
};

const fn = (value) => {
  try {
    throw error("test", value);
  } catch (e) {
    return e.message;
  }
};

export const $main = {
  $default: "",
  $generator: function() {
    return Math.round(Math.random() * 10);
  },
  $function: function(value, blackbox) {
    blackbox(fn(value));
  }
};
