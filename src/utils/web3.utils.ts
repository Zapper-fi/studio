/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 * ref: https://github.com/ChainSafe/web3.js/blob/63e73bb3f8d4720edcc31441c3b613758ad96cec/packages/web3-utils/src/index.js
 * @method asciiToHex
 * @param {String} str
 * @returns {String} hex representation of input string
 */
 export const asciiToHex = (str: string): string => {
  if (!str) return '0x00';
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    const n = code.toString(16);
    hex += n.length < 2 ? '0' + n : n;
  }

  return '0x' + hex;
};

/**
 * Should be called to get ascii from it's hex representation
 *
 * @method hexToAscii
 * @param {String} hex
 * @returns {String} ascii string representation of hex value
 */
 export const hexToAscii = (hex: string): string => {
  let str = "";
  let i = 0, l = hex.length;
  if (hex.substring(0, 2) === '0x') {
    i = 2;
  }
  for (; i < l; i+=2) {
    const code = parseInt(hex.slice(i, i + 2), 16);
    str += String.fromCharCode(code);
  }

  return str;
};