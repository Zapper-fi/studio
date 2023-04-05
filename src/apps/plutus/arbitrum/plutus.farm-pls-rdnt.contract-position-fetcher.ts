import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { PlutusContractFactory } from '../contracts';
import { PlutusFarmPlsRdnt } from '../contracts/ethers/PlutusFarmPlsRdnt';

@PositionTemplate()
export class ArbitrumPlutusFarmPlsRdntContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<PlutusFarmPlsRdnt> {
  groupLabel = 'plsRdnt';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly contractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PlutusFarmPlsRdnt {
    return this.contractFactory.plutusFarmPlsRdnt({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return [
      {
        address: '0xae3f67589acb90bd2cbccd8285b37fe4f8f29042',
        stakedTokenAddress: '0x1605bbdab3b38d10fa23a7ed0d0e8f4fea5bff59',
        rewardTokenAddresses: [
          '0x51318b7d00db7acc4026c88c3952b66278b6a67f', // PLS
          '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // WETH
          '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f', // WBTC
          '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
          '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // USDT
          '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
        ],
      },
    ];
  }

  async getRewardRates() {
    return [0, 0, 0, 0, 0, 0];
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsRdnt>) {
    return contract.userInfo(address).then(v => v.amount);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsRdnt>) {
    return contract.pendingRewards(address);
  }
}
