import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { formatBytes32String } from 'ethers/lib/utils';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { SynthetixContractFactory, SynthetixNetworkToken } from '../contracts';

import { SynthetixMintrSnxHoldersCache } from './synthetix.mintr.snx-holders.cache';

export type SynthetixMintrDataProps = {
  liquidity: number;
};

export abstract class SynthetixMintrContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SynthetixNetworkToken,
  SynthetixMintrDataProps
> {
  abstract snxAddress: string;
  abstract sUSDAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory,
    @Inject(SynthetixMintrSnxHoldersCache) protected readonly holdersCache: SynthetixMintrSnxHoldersCache,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SynthetixNetworkToken {
    return this.contractFactory.synthetixNetworkToken({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: this.snxAddress }];
  }

  async getTokenDefinitions() {
    return [
      { metaType: MetaType.SUPPLIED, address: this.snxAddress },
      { metaType: MetaType.BORROWED, address: this.sUSDAddress },
    ];
  }

  async getDataProps({
    contractPosition,
  }: GetDataPropsParams<
    SynthetixNetworkToken,
    SynthetixMintrDataProps,
    DefaultContractPositionDefinition
  >): Promise<SynthetixMintrDataProps> {
    const holders = await this.holdersCache.getSynthetixHolders(this.network);
    const snxPrice = contractPosition.tokens[0].price;
    const liquidity = sumBy(holders, v => (Number(v.collateral) - Number(v.transferable)) * snxPrice);
    return { liquidity };
  }

  async getLabel() {
    return 'SNX Staking';
  }

  async getTokenBalancesPerPosition({ address, contract, multicall }: GetTokenBalancesParams<SynthetixNetworkToken>) {
    const [collateralRaw, transferableRaw, debtBalanceRaw] = await Promise.all([
      multicall.wrap(contract).collateral(address),
      multicall.wrap(contract).transferableSynthetix(address),
      multicall.wrap(contract).debtBalanceOf(address, formatBytes32String('sUSD')),
    ]);

    const collateralBalanceRaw = new BigNumber(collateralRaw.toString()).minus(transferableRaw.toString()).toFixed(0);
    return [collateralBalanceRaw, debtBalanceRaw.toString()];
  }
}
