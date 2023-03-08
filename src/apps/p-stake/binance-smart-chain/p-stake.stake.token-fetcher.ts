import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams } from '~position/template/app-token.template.types';

import { PStakeContractFactory } from '../contracts';
import { PStakeStkToken } from '../contracts/ethers/PStakeStkToken';

@PositionTemplate()
export class BinanceSmartChainPStakeStakeTokenFetcher extends AppTokenTemplatePositionFetcher<PStakeStkToken> {
  groupLabel = 'Stake';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PStakeContractFactory) protected readonly contractFactory: PStakeContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PStakeStkToken {
    return this.contractFactory.pStakeStkToken({ address, network: this.network });
  }

  async getAddresses() {
    return ['0xc2e9d07f66a89c44062459a47a0d2dc038e4fb16'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: ZERO_ADDRESS, network: this.network }];
  }

  async getPricePerShare({ multicall }: GetPricePerShareParams<PStakeStkToken>) {
    const stakePoolAddress = '0xc228cefdf841defdbd5b3a18dfd414cc0dbfa0d8';
    const stakePool = this.contractFactory.pStakePool({ address: stakePoolAddress, network: this.network });
    const exchangeRateRaw = await multicall.wrap(stakePool).exchangeRate();
    const exchangeRate = Number(exchangeRateRaw.totalWei) / Number(exchangeRateRaw.poolTokenSupply);
    return [exchangeRate];
  }
}
