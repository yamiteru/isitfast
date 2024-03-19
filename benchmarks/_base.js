const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const $primeOriginalLeftPad = {
  $samples: [1, 10, 100, 1000],
  $generator: function(sample) {
    const str = generateString(sample);

    return {
      str,
      len: str.length * 2,
      ch: generateString(1)
    };
  },
  $function: function({str, len, ch}, blackbox) {
    blackbox(new Array(len - str.length).join(!ch && ch !== 0 ? " " : ch) + str);
  }
};
