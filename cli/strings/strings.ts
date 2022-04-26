import _ from 'lodash';

/**
 * Converts a given string to TitleCase
 *
 * @param s given string
 * @returns TitleCased string
 */
const titleCase = (s: string, spaceSeparator = false) => {
  const separator = spaceSeparator === true ? ' ' : '';
  return _.startCase(s).replace(/\s/g, separator);
};

/**
 * Takes an array of strings and join them within new lines.
 * @param xs string[]
 * @returns
 */
const lines = (xs: string[]) => {
  return xs.join('\n');
};

/**
 * Converts a given string to kebab-case
 *
 * @param s given string
 * @returns KebabCased string
 */
const kebabCase = (s: string) => {
  return _.kebabCase(s).replace(/ /g, '-');
};

/**
 * Converts a given string to UPPER_CASE
 *
 * @param s given string
 * @returns UpperCased string
 */
const upperCase = (s: string) => {
  return _.upperCase(s).replace(/ /g, '_');
};

/**
 * Convert a given string to camelCase
 *
 * @param s given string
 * @returns CamelCased string
 */
const camelCase = (s: string) => {
  return _.camelCase(s);
};

export const strings = {
  kebabCase,
  upperCase,
  titleCase,
  camelCase,
  lines,
};
