import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import {
  UniswapV2PoolOnChainTemplateTokenFetcher,
  UniswapV2TokenDataProps,
} from '~apps/uniswap-v2/common/uniswap-v2.pool.on-chain.template.token-fetcher';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';

import { DOLOMITE_AMM_FACTORY_ADDRESSES } from '../common/utils';
import { DolomiteAmmFactory, DolomiteAmmPair, DolomiteContractFactory } from '../contracts';

@PositionTemplate()
export class ArbitrumDolomitePoolsTokenFetcher extends UniswapV2PoolOnChainTemplateTokenFetcher<
  DolomiteAmmPair,
  DolomiteAmmFactory
> {
  factoryAddress = DOLOMITE_AMM_FACTORY_ADDRESSES[this.network];

  isExcludedFromTvl = true;

  groupLabel = 'Pools';
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DolomiteContractFactory) private readonly dolomiteContractFactory: DolomiteContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolTokenContract(address: string): DolomiteAmmPair {
    return this.dolomiteContractFactory.dolomiteAmmPair({ address, network: this.network });
  }

  getPoolFactoryContract(address: string): DolomiteAmmFactory {
    return this.dolomiteContractFactory.dolomiteAmmFactory({ address, network: this.network });
  }

  getPoolsLength(contract: DolomiteAmmFactory): Promise<BigNumberish> {
    return contract.allPairsLength();
  }

  getPoolAddress(contract: DolomiteAmmFactory, index: number): Promise<string> {
    return contract.allPairs(index);
  }

  getPoolToken0(contract: DolomiteAmmPair): Promise<string> {
    return contract.token0();
  }

  getPoolToken1(contract: DolomiteAmmPair): Promise<string> {
    return contract.token1();
  }

  getPoolReserves(contract: DolomiteAmmPair): Promise<BigNumberish[]> {
    return contract.getReservesWei();
  }

  async getLabel({ appToken }: GetDisplayPropsParams<DolomiteAmmPair, UniswapV2TokenDataProps>): Promise<string> {
    const label = appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
    return label.replace('WETH', 'ETH');
  }

  async getSecondaryLabel(_params: GetDisplayPropsParams<DolomiteAmmPair, UniswapV2TokenDataProps>) {
    return '50% / 50%';
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<DolomiteAmmPair, UniswapV2TokenDataProps>) {
    const { fee, reserves, liquidity, volume, apy } = appToken.dataProps;
    const reservesDisplay = reserves
      .map(v => {
        if (Number.isNaN(v) || v === 0) {
          return '0';
        }
        return v < 0.01 ? '<0.01' : v.toFixed(2);
      })
      .join(' / ');

    return [
      { label: 'Fee', value: buildPercentageDisplayItem(fee) },
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'Reserves', value: reservesDisplay },
      { label: 'Ratio', value: '50% / 50%' },
      { label: 'Volume', value: buildDollarDisplayItem(volume) },
      { label: 'APY', value: buildPercentageDisplayItem(apy) },
    ];
  }
}
