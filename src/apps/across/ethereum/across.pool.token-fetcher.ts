import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDataPropsParams,
  GetPriceParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import ACROSS_DEFINITION from '../across.definition';
import { AcrossContractFactory, BadgerPool } from '../contracts';

export type AcrossPoolTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
  isLegacy: boolean;
};

const v1Pools = [
  {
    address: '0x43298f9f91a4545df64748e78a2c777c580573d6',
    underlyingTokenAddress: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
    isLegacy: true,
  },
  {
    address: '0x4841572daa1f8e4ce0f62570877c2d0cc18c9535',
    underlyingTokenAddress: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
    isLegacy: true,
  },
  {
    address: '0x43f133fe6fdfa17c417695c476447dc2a449ba5b',
    underlyingTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    isLegacy: true,
  },
  {
    address: '0xdfe0ec39291e3b60aca122908f86809c9ee64e90',
    underlyingTokenAddress: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
    isLegacy: true,
  },
  {
    address: '0x256c8919ce1ab0e33974cf6aa9c71561ef3017b6',
    underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    isLegacy: true,
  },
  {
    address: '0x02fbb64517e1c6ed69a6faa3abf37db0482f1152',
    underlyingTokenAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    isLegacy: true,
  },
  {
    address: '0x7355efc63ae731f584380a9838292c7046c1e433',
    underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    isLegacy: true,
  },
];
const v2Pools = [
  {
    address: '0x43298f9f91a4545df64748e78a2c777c580573d6',
    underlyingTokenAddress: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
    isLegacy: true,
  },
  {
    address: '0x4841572daa1f8e4ce0f62570877c2d0cc18c9535',
    underlyingTokenAddress: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
    isLegacy: true,
  },
  {
    address: '0x43f133fe6fdfa17c417695c476447dc2a449ba5b',
    underlyingTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    isLegacy: true,
  },
  {
    address: '0xdfe0ec39291e3b60aca122908f86809c9ee64e90',
    underlyingTokenAddress: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
    isLegacy: true,
  },
  {
    address: '0x256c8919ce1ab0e33974cf6aa9c71561ef3017b6',
    underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    isLegacy: true,
  },
  {
    address: '0x02fbb64517e1c6ed69a6faa3abf37db0482f1152',
    underlyingTokenAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    isLegacy: true,
  },
  {
    address: '0x7355efc63ae731f584380a9838292c7046c1e433',
    underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    isLegacy: true,
  },
];

const appId = ACROSS_DEFINITION.id;
const groupId = ACROSS_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAcrossPoolTokenFetcher extends AppTokenTemplatePositionFetcher<BadgerPool> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AcrossContractFactory) protected readonly contractFactory: AcrossContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BadgerPool {
    return this.contractFactory.badgerPool({ network: this.network, address });
  }

  async getDefinitions(): Promise<AcrossPoolTokenDefinition[]> {
    return [...v1Pools, ...v2Pools];
  }

  async getAddresses({ definitions }: GetAddressesParams<AcrossPoolTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({ definition }: GetUnderlyingTokensParams<BadgerPool, AcrossPoolTokenDefinition>) {
    return definition.underlyingTokenAddress;
  }

  async getPricePerShare({ contract, appToken, multicall }: GetPricePerShareParams<BadgerPool>) {
    const pricePerShareRaw = await multicall.wrap(contract).callStatic.exchangeRateCurrent();
    const decimals = appToken.tokens[0].decimals;

    return Number(pricePerShareRaw) / 10 ** decimals;
  }

  async getPrice({ appToken }: GetPriceParams<BadgerPool>) {
    return appToken.tokens[0].price * Number(appToken.pricePerShare);
  }

  async getDataProps(opts: GetDataPropsParams<BadgerPool>) {
    const { appToken } = opts;
    const liquidity = appToken.price * appToken.supply;

    return { liquidity };
  }
}
