import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { ContractType } from '~position/contract.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';
import { Token } from '~position/position.interface';
import { WithMetaType } from '~position/display.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';

import { bnToFloat } from '../utils';

const appId = SOLACE_DEFINITION.id;
const groupId = SOLACE_DEFINITION.groups.bonds.id;
const network = Network.ETHEREUM_MAINNET;

const SOLACE_ADDRESS = "0x501ace9c35e60f03a2af4d484f49f9b1efde9f40";
const SCP_ADDRESS    = "0x501acee83a6f269b77c167c6701843d454e2efa0";
const ZERO_ADDRESS   = "0x0000000000000000000000000000000000000000";

const BOND_TELLERS = [
  {
    "name": "Solace DAI Bond",
    "address": "0x501ace677634fd09a876e88126076933b686967a",
    "deposit": "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  {
    "name": "Solace ETH Bond",
    "address": "0x501ace95141f3eb59970dd64af0405f6056fb5d8",
    "deposit": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
  },
  {
    "name": "Solace USDC Bond",
    "address": "0x501ace7e977e06a3cb55f9c28d5654c9d74d5ca9",
    "deposit": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  },
  {
    "name": "Solace WBTC Bond",
    "address": "0x501acef0d0c73bd103337e6e9fd49d58c426dc27",
    "deposit": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
  },
  {
    "name": "Solace USDT Bond",
    "address": "0x501ace5ceec693df03198755ee80d4ce0b5c55fe",
    "deposit": "0xdac17f958d2ee523a2206206994597c13d831ec7"
  },
  {
    "name": "Solace SCP Bond",
    "address": "0x501ace00fd8e5db7c3be5e6d254ba4995e1b45b7",
    "deposit": "0x501acee83a6f269b77c167c6701843d454e2efa0"
  },
  {
    "name": "Solace FRAX Bond",
    "address": "0x501acef4f8397413c33b13cb39670ad2f17bfe62",
    "deposit": "0x853d955acef822db058eb8505911ed77f175b99e"
  }
];

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumSolaceBondsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const solace = baseTokens.find((t:WithMetaType<Token>) => t.address === SOLACE_ADDRESS);
    const positions = await Promise.all(BOND_TELLERS.map(async teller => {
      const tokens:WithMetaType<Token>[] = [];
      const depositToken = await this.getToken(baseTokens, teller.deposit);
      if(!!depositToken) tokens.push(supplied(depositToken));
      if(!!solace) tokens.push(claimable(solace));
      return {
        type: ContractType.POSITION,
        appId,
        groupId,
        address: teller.address,
        network,
        tokens
      };
    }));
    return positions;
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
    }
    return undefined;
  }
}
