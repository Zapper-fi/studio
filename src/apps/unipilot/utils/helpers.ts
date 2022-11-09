import { ChainId } from '@kyberswap/ks-sdk-core';

export const convertToQueryString = (queryParams: { [key: string]: string | ChainId }) => {
  if (!queryParams) {
    return '';
  }

  return Object.entries(queryParams)
    .filter(([key, value]) => !!value)
    .map(([key, value]) => {
      return `${key}=${encodeURI(value + '')}`;
    })
    .join('&');
};
