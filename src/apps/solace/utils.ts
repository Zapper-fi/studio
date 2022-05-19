import { Network } from '~types/network.interface';
import { Token } from '~position/position.interface';
import { WithMetaType } from '~position/display.interface';

import { SolaceContractFactory } from './contracts';

import { BigNumberish, ethers } from 'ethers';
const formatUnits = ethers.utils.formatUnits;

const SOLACE_ADDRESS = "0x501ace9c35e60f03a2af4d484f49f9b1efde9f40";
const ZERO_ADDRESS   = "0x0000000000000000000000000000000000000000";
// note: these are only on ethereum
const SCP_ADDRESS    = "0x501acee83a6f269b77c167c6701843d454e2efa0";
const SLP_ADDRESS    = "0x9c051f8a6648a51ef324d30c235da74d060153ac";
const USDC_ADDRESS   = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

// similar to python's built in range()
// returns an array of numbers starting at start and stopping before stop
export function range(start: number, stop: number) {
  const arr: number[] = [];
  for(let i = start; i < stop; i++) arr.push(i);
  return arr;
}

// given a BigNumber and an amount of decimals
// returns the number as a float
// note: uses currying
export function bnToFloat(decimals: number = 0) {
  function f(num: BigNumberish) {
    return parseFloat(formatUnits(num, decimals));
  }
  return f;
}

// given a list of tokens, finds the desired token
// also useful for finding app specific tokens not in the base list
export async function findToken(baseTokens:WithMetaType<Token>[], tokenAddress:string, solaceContractFactory:SolaceContractFactory, network:Network) : Promise<Token | undefined>{
  // default case: token is in the list
  const token = baseTokens.find((t:WithMetaType<Token>) => t.address === tokenAddress);
  if(!!token) return token;
  // app specific token 1: SCP
  if(tokenAddress === SCP_ADDRESS) {
    const scp = solaceContractFactory.scp({ address: SCP_ADDRESS, network });
    const pps = await scp.pricePerShare();
    const eth = baseTokens.find((t:WithMetaType<Token>) => t.address === ZERO_ADDRESS);
    const ethPrice = eth?.price ?? 0.0;
    const scpPrice = ethPrice * bnToFloat(18)(pps);
    return {
      "metaType": "supplied",
      "type": "app-token",
      "network": "ethereum",
      "address": SCP_ADDRESS,
      "decimals": 18,
      "symbol": "SCP",
      "price": scpPrice
    } as any as Token;
  }
  // app specific token 2: SLP
  else if(tokenAddress === SLP_ADDRESS) {
    const solace = baseTokens.find((t:WithMetaType<Token>) => t.address === SOLACE_ADDRESS);
    const usdc = baseTokens.find((t:WithMetaType<Token>) => t.address === USDC_ADDRESS);
    const solacePrice = solace?.price ?? 0.0;
    const usdcPrice = usdc?.price ?? 0.0;
    const solaceContract = solaceContractFactory.erc20({ address: SOLACE_ADDRESS, network });
    const usdcContract = solaceContractFactory.erc20({ address: USDC_ADDRESS, network });
    const slpContract = solaceContractFactory.erc20({ address: SLP_ADDRESS, network });
    const [s, u, ts] = await Promise.all([
      solaceContract.balanceOf(SLP_ADDRESS).then(bnToFloat(18)),
      usdcContract.balanceOf(SLP_ADDRESS).then(bnToFloat(6)),
      slpContract.totalSupply().then(bnToFloat(18)),
    ])
    const slpPrice = (s*solacePrice + u*usdcPrice) / ts;
    return {
      "metaType": "supplied",
      "type": "app-token",
      "network": "ethereum",
      "address": SLP_ADDRESS,
      "decimals": 18,
      "symbol": "SLP",
      "price": slpPrice
    }
  }
  // fall through case: unknown
  return undefined;
}
