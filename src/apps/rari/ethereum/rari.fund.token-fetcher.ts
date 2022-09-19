import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
} from '~position/template/app-token.template.types';

import { RariContractFactory } from '../contracts';

const SYMBOL_TO_ADDRESS = {
  DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
  USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  mUSD: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
};

const RARI_POOL_DEFINITIONS = [
  {
    label: 'USDC Pool',
    poolManagerAddress: '0xc6bf8c8a55f77686720e0a88e2fd1feef58ddf4a',
    poolTokenAddress: '0x016bf078abcacb987f0589a6d3beadd4316922b0',
  },
  {
    label: 'Ether Pool',
    isEther: true,
    poolManagerAddress: '0xd6e194af3d9674b62d1b30ec676030c23961275e',
    poolTokenAddress: '0xcda4770d65b4211364cb870ad6be19e7ef1d65f4',
  },
  {
    label: 'Yield Pool',
    poolManagerAddress: '0x59fa438cd0731ebf5f4cdcaf72d4960efd13fce6',
    poolTokenAddress: '0x3baa6b7af0d72006d3ea770ca29100eb848559ae',
  },
  {
    label: 'DAI Pool',
    poolManagerAddress: '0xb465baf04c087ce3ed1c266f96ca43f4847d9635',
    poolTokenAddress: '0x0833cfcb11a5ba89fbaf73a407831c98ad2d7648',
  },
];

@PositionTemplate()
export class EthereumRariFundTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'Funds';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RariContractFactory) protected readonly contractFactory: RariContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getAddresses() {
    return RARI_POOL_DEFINITIONS.map(v => v.poolTokenAddress);
  }

  async getUnderlyingTokenAddresses({ multicall, address }: GetUnderlyingTokensParams<Erc20>) {
    const { poolManagerAddress, isEther } = RARI_POOL_DEFINITIONS.find(v => v.poolTokenAddress === address)!;
    if (isEther) return [ZERO_ADDRESS];

    const managerContract = this.contractFactory.rariFundManager({
      address: poolManagerAddress,
      network: this.network,
    });

    const symbols = await multicall.wrap(managerContract).callStatic.getAcceptedCurrencies();
    return symbols.map(v => SYMBOL_TO_ADDRESS[v]!);
  }

  async getPricePerShare({ appToken }: GetPricePerShareParams<Erc20>) {
    const { poolManagerAddress } = RARI_POOL_DEFINITIONS.find(v => v.poolTokenAddress === appToken.address)!;

    const managerContract = this.contractFactory.rariFundManager({
      address: poolManagerAddress,
      network: this.network,
    });

    const liquidityRaw = await managerContract.callStatic.getFundBalance();
    const liquidity = Number(liquidityRaw) / 10 ** 18;
    const reserves = appToken.tokens.map(() => liquidity / appToken.tokens.length);
    const pricePerShare = reserves.map(v => v / appToken.supply);

    return pricePerShare;
  }

  getLiquidity({ appToken }: GetDataPropsParams<Erc20>) {
    return appToken.supply * appToken.price;
  }

  getReserves({ appToken }: GetDataPropsParams<Erc20>) {
    return (appToken.pricePerShare as number[]).map(t => t * appToken.supply);
  }

  getApy(_params: GetDataPropsParams<Erc20>) {
    return 0;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<Erc20, DefaultDataProps>) {
    const { label } = RARI_POOL_DEFINITIONS.find(v => v.poolTokenAddress === appToken.address)!;
    return label;
  }
}
