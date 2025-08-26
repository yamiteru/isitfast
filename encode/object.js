const buffer = new ArrayBuffer(128);
const array = new Uint8Array(buffer);
let offset = 0;

const textEncoder = new TextEncoder();

const TYPES = {
  uint8(_, value) {
    array[offset++] = value;
  },
  string(type, value) {
    array[offset++] = value.length;

    offset += textEncoder.encodeInto(value, array.subarray(offset)).written;
  },
  array(type, value) {
    array[offset++] = value.length;

    for (let i = 0; i < value.length; i++) {
      TYPES[type.item.type](type.item, value[i]);
    }
  },
  object(type, value) {
    for (let i = 0; i < type.properties.length; i++) {
      TYPES[type.properties[i].type](type.properties[i], value[type.properties[i].key]);
    }
  }
};

const encode = (type, value) => {
  offset = 0;

  TYPES[type.type](type, value);

  return buffer.slice(0, offset);
};

const type = {
  type: "object",
  properties: [
    {
      key: "name",
      type: "string",
    },
    {
      key: "age",
      type: "uint8"
    },
    {
      key: "grades",
      type: "array",
      item: {
        type: "uint8"
      }
    },
  ]
};

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
    encode(type, value);
  }
};
