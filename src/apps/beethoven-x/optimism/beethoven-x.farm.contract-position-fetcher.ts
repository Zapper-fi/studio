import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { SingleStakingFarmContractPositionHelper } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { BalancerV2ContractFactory } from '~apps/balancer-v2';
import { BalancerGauge } from '~apps/balancer-v2/contracts';
import { BalancerV2GaugeRewardTokenStrategy } from '~apps/balancer-v2/helpers/balancer-v2.reward-token-strategy';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';

const appId = BEETHOVEN_X_DEFINITION.id;
const groupId = BEETHOVEN_X_DEFINITION.groups.farm.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismBeethovenXFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ContractFactory)
    private readonly balancerV2ContractFactory: BalancerV2ContractFactory,
    @Inject(SingleStakingFarmContractPositionHelper)
    private readonly stakingHelper: SingleStakingFarmContractPositionHelper,
    @Inject(BalancerV2GaugeRewardTokenStrategy)
    private readonly gaugeRewardTokenStrategy: BalancerV2GaugeRewardTokenStrategy,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const gaugeFactoryContract = this.balancerV2ContractFactory.balancerChildChainGaugeFactory({
      address: '0x2e96068b3d5b5bae3d7515da4a1d2e52d08a2647',
      network,
    });

    const poolTokens = await this.appToolkit.getAppTokenPositions({
      appId,
      groupIds: [BEETHOVEN_X_DEFINITION.groups.pool.id],
      network,
    });

    const farms = await Promise.all(
      poolTokens.map(async pool => {
        return await multicall
          .wrap(gaugeFactoryContract)
          .getPoolGauge(pool.address)
          .then(r => r.toLowerCase())
          .catch(() => ZERO_ADDRESS);
      }),
    ).then(r => r.filter(v => v !== ZERO_ADDRESS));

    const positions = await this.stakingHelper.getContractPositions<BalancerGauge>({
      network,
      appId,
      groupId,
      dependencies: [
        {
          appId,
          groupIds: [BEETHOVEN_X_DEFINITION.groups.pool.id],
          network,
        },
      ],
      resolveFarmAddresses: () => farms,
      resolveFarmContract: ({ address, network }) => this.balancerV2ContractFactory.balancerGauge({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
      resolveRewardTokenAddresses: this.gaugeRewardTokenStrategy.build(),
      resolveRois: async () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });

    return compact(positions);
  }
}
