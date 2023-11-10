import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isClaimable, isSupplied } from '~position/position.utils';
import {
  GetTokenDefinitionsParams,
  GetDataPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';
import { SingleStakingFarmDynamicTemplateContractPositionFetcher } from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { TraderJoeViemContractFactory } from '../contracts';
import { TraderJoeStableStaking } from '../contracts/viem';

@PositionTemplate()
export class AvalancheTraderJoeSJoeContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<TraderJoeStableStaking> {
  groupLabel = 'sJOE';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeViemContractFactory) protected readonly contractFactory: TraderJoeViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.traderJoeStableStaking({ address, network: this.network });
  }

  async getFarmAddresses() {
    return ['0x1a731b2299e22fbac282e7094eda41046343cb51'];
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<TraderJoeStableStaking>) {
    return contract.read.joe();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<TraderJoeStableStaking>) {
    const length = await contract.read.rewardTokensLength().then(Number);
    return Promise.all(_.range(length).map(i => contract.read.rewardTokens([BigInt(i)])));
  }

  async getRewardRates(_params: GetDataPropsParams<TraderJoeStableStaking>) {
    return [0];
  }

  async getStakedTokenBalance({ address, contract, contractPosition }: GetTokenBalancesParams<TraderJoeStableStaking>) {
    const supplied = contractPosition.tokens.find(isSupplied)!;
    return contract.read.getUserInfo([address, supplied.address]).then(v => v[0]);
  }

  getRewardTokenBalances({ address, contract, contractPosition }: GetTokenBalancesParams<TraderJoeStableStaking>) {
    const claimable = contractPosition.tokens.find(isClaimable)!;
    return contract.read.pendingReward([address, claimable.address]);
  }
}
