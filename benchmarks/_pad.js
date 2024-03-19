export const $primeOriginalLeftPad = function({str, len, ch}, blackbox) {
  blackbox(new Array(len - str.length).join(!ch && ch !== 0 ? " " : ch) + str);
}

export const $ember2 = function({str, len, ch}, blackbox) {
  let p = "";
  len = len - str.length;
  if (len <= 0) return s;
  ch = ch || " ";
  while (true) {
    p = len & 1 ? p + ch : p;
    len = len >> 1;
    if (!len) break;
    ch += ch;
  }

  blackbox(p + str);
}

export const $nativePadStart = function({str, len, ch}, blackbox) {
  blackbox(str.padStart(len, ch));
}

export const $leftPad = function({str, len, ch}, blackbox) {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = " ";
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }

  blackbox(str);
}

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const $padSuite = {
  $default: "",
  $samples: [1, 10, 100, 1000],
  $generator: (sample) => {
    const str = generateString(sample);

    return {
      str,
      len: str.length * 2,
      ch: generateString(1)
    };
  },
  $cases: {
    $primeOriginalLeftPad,
    $ember2,
    $nativePadStart,
    $leftPad
  }
};
