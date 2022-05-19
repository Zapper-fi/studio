import { BigNumberish, ethers } from 'ethers';
const formatUnits = ethers.utils.formatUnits;

export function range(start: number, stop: number) {
  const arr: number[] = [];
  for(let i = start; i < stop; i++) arr.push(i);
  return arr;
}

export function bnToFloat(decimals: number = 0) {
  function f(num: BigNumberish) {
    return parseFloat(formatUnits(num, decimals));
  }
  return f;
}
