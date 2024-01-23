import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { PlutusViemContractFactory } from '../contracts';
import { PlutusFarmPlsRdnt } from '../contracts/viem/PlutusFarmPlsRdnt';

export type PlutusFarmDefinition = SingleStakingFarmDefinition & {
  label: string;
};

@PositionTemplate()
export class ArbitrumPlutusFarmPlsRdntContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<
  PlutusFarmPlsRdnt,
  SingleStakingFarmDataProps,
  PlutusFarmDefinition
> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusViemContractFactory) protected readonly contractFactory: PlutusViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.plutusFarmPlsRdnt({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<PlutusFarmDefinition[]> {
    return [
      {
        address: '0xae3f67589acb90bd2cbccd8285b37fe4f8f29042',
        stakedTokenAddress: '0x1605bbdab3b38d10fa23a7ed0d0e8f4fea5bff59',
        label: 'plsRDNT',
        rewardTokenAddresses: [
          '0x51318b7d00db7acc4026c88c3952b66278b6a67f', // PLS
          '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f', // WBTC
          '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // USDT
          '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
          '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
          '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // WETH
        ],
      },
    ];
  }

  async getRewardRates() {
    return [0, 0, 0, 0, 0, 0];
  }

  async getIsActive() {
    return true;
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<PlutusFarmPlsRdnt, SingleStakingFarmDataProps, PlutusFarmDefinition>) {
    return definition.label;
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsRdnt>) {
    return contract.read.userInfo([address]).then(v => v[0]);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsRdnt>) {
    try {
      const rewards = await contract.read.pendingRewards([address]);
      return [rewards.pls, rewards.wbtc, rewards.usdt, rewards.usdc, rewards.dai, rewards.weth];
    } catch (error) {
      return [0, 0, 0, 0, 0, 0];
    }
  }
}
