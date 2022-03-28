import _ from 'lodash';

/**
 * Converts a given string to TitleCase
 *
 * @param s given string
 * @returns TitleCased string
 */
const titleCase = (s: string) => {
  return _.startCase(s).replace(/\s/g, '');
};

/**
 * Takes an array of strings and join them within new lines.
 * @param xs string[]
 * @returns 
 */
const lines = (xs: string[]) => {
  return xs.join('\n');
};

export const strings = {
  titleCase,
  lines,
};
