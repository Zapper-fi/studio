import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';
import { Token } from '~position/position.interface';
import { WithMetaType } from '~position/display.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';

import { ethers } from 'ethers';
const formatUnits = ethers.utils.formatUnits;
import { bnToFloat, range } from '~apps/solace/utils';

const appId = SOLACE_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

// TODO: there is more to TVL than amount in the UWP
// since its the bulk we call it sufficient for now
const UWP_ADDRESS    = "0x5efC0d9ee3223229Ce3b53e441016efC5BA83435";
const SOLACE_ADDRESS = "0x501ace9c35e60f03a2af4d484f49f9b1efde9f40";
const SCP_ADDRESS    = "0x501acee83a6f269b77c167c6701843d454e2efa0";
const SLP_ADDRESS    = "0x9c051f8a6648a51ef324d30c235da74d060153ac";
const USDC_ADDRESS   = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const ZERO_ADDRESS   = "0x0000000000000000000000000000000000000000";
const TOKENS = [
  {
    "symbol": "SOLACE",
    "address": "0x501ace9c35e60f03a2af4d484f49f9b1efde9f40",
    "decimals": 18
  },
  {
    "symbol": "FRAX",
    "address": "0x853d955acef822db058eb8505911ed77f175b99e",
    "decimals": 18
  },
  {
    "symbol": "USDC",
    "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "decimals": 6
  },
  {
    "symbol": "USDT",
    "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
    "decimals": 6
  },
  {
    "symbol": "DAI",
    "address": "0x6b175474e89094c44da98b954eedeac495271d0f",
    "decimals": 18
  },
  {
    "symbol": "WETH",
    "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "decimals": 18
  },
  {
    "symbol": "WBTC",
    "address": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    "decimals": 8
  },
  {
    "symbol": "ETH",
    "address": "0x0000000000000000000000000000000000000000",
    "decimals": 18
  },
  {
    "symbol": "SCP",
    "address": "0x501acee83a6f269b77c167c6701843d454e2efa0",
    "decimals": 18
  },
  {
    "symbol": "SLP",
    "address": "0x9c051f8a6648a51ef324d30c235da74d060153ac",
    "decimals": 18
  },
];

@Register.TvlFetcher({ appId, network })
export class EthereumSolaceTvlFetcher implements TvlFetcher {
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
        return provider.getBalance(UWP_ADDRESS).then(bnToFloat(token.decimals));
      } else {
        const tokenContract = this.solaceContractFactory.erc20({ address: token.address, network });
        if(!provider) provider = tokenContract.provider;
        const mct = multicall.wrap(tokenContract);
        return mct.balanceOf(UWP_ADDRESS).then(bnToFloat(token.decimals));
      }
    }));
    let usd = 0;
    await Promise.all(indices.map(async (i:number) => {
      const zapperToken = await this.getToken(baseTokens, TOKENS[i].address);
      if(!zapperToken) return;
      usd += balances[i] * zapperToken.price;
    }));
    return usd;
  }

  async getToken(baseTokens:WithMetaType<Token>[], tokenAddress:string) {
    const token = baseTokens.find((t:WithMetaType<Token>) => t.address === tokenAddress);
    if(!!token) return token;
    if(tokenAddress === SCP_ADDRESS) {
      const scp = this.solaceContractFactory.scp({ address: SCP_ADDRESS, network });
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
      }
    } else if(tokenAddress === SLP_ADDRESS) {
      const solace = baseTokens.find((t:WithMetaType<Token>) => t.address === SOLACE_ADDRESS);
      const usdc = baseTokens.find((t:WithMetaType<Token>) => t.address === USDC_ADDRESS);
      const solacePrice = solace?.price ?? 0.0;
      const usdcPrice = usdc?.price ?? 0.0;
      const solaceContract = this.solaceContractFactory.erc20({ address: SOLACE_ADDRESS, network });
      const usdcContract = this.solaceContractFactory.erc20({ address: USDC_ADDRESS, network });
      const slpContract = this.solaceContractFactory.erc20({ address: SLP_ADDRESS, network });
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
    return undefined;
  }
}
