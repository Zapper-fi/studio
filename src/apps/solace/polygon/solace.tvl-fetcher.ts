import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';

import { ethers } from 'ethers';
const formatUnits = ethers.utils.formatUnits;

const appId = SOLACE_DEFINITION.id;
const network = Network.POLYGON_MAINNET;

// TODO: there is more to TVL than amount in the UWP
// since its the bulk we call it sufficient for now
const UWP_ADDRESS    = "0xd1108a800363c262774b990e9df75a4287d5c075";
const ZERO_ADDRESS   = "0x0000000000000000000000000000000000000000";
const TOKENS = [
  {
    "symbol": "SOLACE",
    "address": "0x501ace9c35e60f03a2af4d484f49f9b1efde9f40",
    "decimals": 18
  },
  {
    "symbol": "FRAX",
    "address": "0x45c32fa6df82ead1e2ef74d17b76547eddfaff89",
    "decimals": 18
  },
  {
    "symbol": "USDC",
    "address": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    "decimals": 6
  },
  {
    "symbol": "USDT",
    "address": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    "decimals": 6
  },
  {
    "symbol": "DAI",
    "address": "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    "decimals": 18
  },
  {
    "symbol": "WETH",
    "address": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    "decimals": 18
  },
  {
    "symbol": "WBTC",
    "address": "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
    "decimals": 8
  },
  {
    "symbol": "MATIC",
    "address": "0x0000000000000000000000000000000000000000",
    "decimals": 18
  },
  {
    "symbol": "WMATIC",
    "address": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    "decimals": 18
  }
  // TODO: LP
];

@Register.TvlFetcher({ appId, network })
export class PolygonSolaceTvlFetcher implements TvlFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory
  ) {}

  async getTvl() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const multicall = this.appToolkit.getMulticall(network);
    const indices = range(0, TOKENS.length);
    let provider: any = undefined;
    const balances = await Promise.all(TOKENS.map(token => {
      if(token.address === ZERO_ADDRESS) {
        return provider.getBalance(UWP_ADDRESS).then((bal:any) => parseFloat(formatUnits(bal, token.decimals)));
      } else {
        const tokenContract = this.solaceContractFactory.erc20({ address: token.address, network });
        if(!provider) provider = tokenContract.provider;
        const mct = multicall.wrap(tokenContract);
        return mct.balanceOf(UWP_ADDRESS).then((bal:any) => parseFloat(formatUnits(bal, token.decimals)));
      }
    }));
    let usd = 0;
    await Promise.all(indices.map(async (i:any) => {
      const zapperToken = await this.getToken(baseTokens, TOKENS[i].address);
      if(!zapperToken) return;
      usd += balances[i] * zapperToken.price;
    }));
    return usd;
  }

  async getToken(baseTokens:any, tokenAddress:string) {
    const token = baseTokens.find((v:any) => v.address === tokenAddress);
    if(!!token) return token;
    return undefined;
  }
}

function range(start: any, stop: any) {
  const arr: any = [];
  for(let i = start; i < stop; i++) arr.push(i);
  return arr;
}
