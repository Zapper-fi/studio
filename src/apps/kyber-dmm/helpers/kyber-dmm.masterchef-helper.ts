import { Inject, Injectable } from '@nestjs/common';
import { Network } from '@zapper-fi/types/networks';

import { ZERO_ADDRESS } from '~constants/common';
import { MasterChefContractPositionBalanceHelper } from '~position/helpers/master-chef.contract-position-balance-helper';
import { MasterChefContractPositionHelper } from '~position/helpers/master-chef.contract-position-helper';

import { KyberDmmContractFactory, KyberDmmMasterchef } from '../contracts';
import { KYBER_DMM_DEFINITION } from '../kyber-dmm.definition';

@Injectable()
export class KyberDmmMasterchefHelper {
  constructor(
    @Inject(MasterChefContractPositionHelper) private readonly positionHelper: MasterChefContractPositionHelper,
    @Inject(MasterChefContractPositionBalanceHelper) private balanceHelper: MasterChefContractPositionBalanceHelper,
    @Inject(KyberDmmContractFactory) private readonly contractFactory: KyberDmmContractFactory,
  ) {}

  getPositions({
    address,
    network,
    groupId,
    appId,
  }: {
    address: string;
    network: Network;
    groupId: string;
    appId: string;
  }) {
    return this.positionHelper.getContractPositions<KyberDmmMasterchef>({
      appId,
      network,
      groupId,
      address,
      resolveContract: opts => this.contractFactory.kyberDmmMasterchef(opts),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ multicall, contract, poolIndex }) =>
        multicall
          .wrap(contract)
          .getPoolInfo(poolIndex)
          .then(i => i.stakeToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) =>
        multicall
          .wrap(contract)
          .getRewardTokens()
          .then(r => r.filter(a => a.toLowerCase() !== ZERO_ADDRESS)),
      resolveRewardsPerBlock: ({ multicall, contract, poolIndex }) =>
        multicall
          .wrap(contract)
          .getPoolInfo(poolIndex)
          .then(v => v.rewardPerBlocks),
      dependencies: [{ appId: KYBER_DMM_DEFINITION.id, groupIds: [KYBER_DMM_DEFINITION.groups.pool.id], network }],
    });
  }

  getBalances({
    address,
    appId,
    groupId,
    network,
  }: {
    address: string;
    appId: string;
    groupId: string;
    network: Network;
  }) {
    return this.balanceHelper.getBalances<KyberDmmMasterchef>({
      address,
      appId,
      groupId,
      network,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.kyberDmmMasterchef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.balanceHelper.buildDefaultStakedBalanceStrategy({
        resolveStakedBalance: ({ multicall, contract, contractPosition }) =>
          multicall
            .wrap(contract)
            .getUserInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.balanceHelper.buildDefaultClaimableTokenStrategy({
        resolveClaimableBalance: ({ multicall, contract, contractPosition }) =>
          multicall
            .wrap(contract)
            .pendingRewards(contractPosition.dataProps.poolIndex, address)
            .then(v => v[0]),
      }),
    });
  }
}
