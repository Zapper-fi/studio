import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types';

import { BOTTO_DEFINITION } from '../botto.definition';
import { BottoContractFactory, BottoLiquidityMining } from '../contracts';

@Injectable()
export class EthereumBottoFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<BottoLiquidityMining> {
  appId = BOTTO_DEFINITION.id;
  groupId = BOTTO_DEFINITION.groups.farm.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BottoContractFactory) protected readonly contractFactory: BottoContractFactory,
  ) {
    super(appToolkit);
  }

  async getFarmDefinitions() {
    return [
      {
        address: '0xf8515cae6915838543bcd7756f39268ce8f853fd',
        stakedTokenAddress: '0x9ff68f61ca5eb0c6606dc517a9d44001e564bb66',
        rewardTokenAddresses: ['0x9dfad1b7102d46b1b197b90095b5c4e9f5845bba'],
      },
    ];
  }

  getContract(address: string): BottoLiquidityMining {
    return this.contractFactory.bottoLiquidityMining({ address, network: this.network });
  }

  async getRewardRates({ contract }: GetDataPropsParams<BottoLiquidityMining, SingleStakingFarmDataProps>) {
    const [totalRewards, startTime, endTime] = await Promise.all([
      contract.totalRewards(),
      contract.firstStakeTime(),
      contract.endTime(),
    ]);

    return totalRewards.div(endTime.sub(startTime));
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<BottoLiquidityMining, SingleStakingFarmDataProps>) {
    return contract.totalUserStake(address);
  }

  getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesParams<BottoLiquidityMining, SingleStakingFarmDataProps>): Promise<BigNumberish | BigNumberish[]> {
    return contract.callStatic
      .withdraw({ from: address })
      .then(res => res.reward)
      .catch(() => 0);
  }
}
