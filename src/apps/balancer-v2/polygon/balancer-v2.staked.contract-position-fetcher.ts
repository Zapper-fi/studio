import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { SingleStakingFarmContractPositionHelper } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerGauge, BalancerV2ContractFactory } from '../contracts';
import { BalancerV2GaugeRewardTokenStrategy } from '../helpers/balancer-v2.reward-token-strategy';

const appId = BALANCER_V2_DEFINITION.id;
const groupId = BALANCER_V2_DEFINITION.groups.farm.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonBalancerV2StakedfContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ContractFactory)
    private readonly balancerV2ContractFactory: BalancerV2ContractFactory,
    @Inject(SingleStakingFarmContractPositionHelper)
    private readonly curveStakingHelper: SingleStakingFarmContractPositionHelper,
    @Inject(BalancerV2GaugeRewardTokenStrategy)
    private readonly gaugeRewardTokenStrategy: BalancerV2GaugeRewardTokenStrategy,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const gaugeFactoryContract = this.balancerV2ContractFactory.balancerChildChainGaugeFactory({
      address: '0x3b8ca519122cdd8efb272b0d3085453404b25bd0',
      network,
    });

    const balancerPoolTokens = await this.appToolkit.getAppTokenPositions({
      appId,
      groupIds: [BALANCER_V2_DEFINITION.groups.pool.id],
      network,
    });

    const farms = await Promise.all(
      balancerPoolTokens.map(async pool => {
        return await multicall
          .wrap(gaugeFactoryContract)
          .getPoolGauge(pool.address)
          .then(r => r.toLowerCase())
          .catch(() => ZERO_ADDRESS);
      }),
    ).then(r => r.filter(v => v !== ZERO_ADDRESS));

    const positions = await this.curveStakingHelper.getContractPositions<BalancerGauge>({
      network,
      appId,
      groupId,
      dependencies: [
        {
          appId,
          groupIds: [BALANCER_V2_DEFINITION.groups.pool.id],
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
