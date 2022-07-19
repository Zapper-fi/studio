import { Inject } from '@nestjs/common';

import { SingleStakingFarmContractPositionHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerGauge, BalancerV2ContractFactory } from '../contracts';
import { BalancerV2GaugeAddressesGetter } from '../helpers/balancer-v2.gauge-addresses-getter';

const appId = BALANCER_V2_DEFINITION.id;
const groupId = BALANCER_V2_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumBalancerV2StakedContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(BalancerV2ContractFactory)
    private readonly balancerV2ContractFactory: BalancerV2ContractFactory,
    @Inject(BalancerV2GaugeAddressesGetter)
    private readonly balancerV2GaugeAddressesGetter: BalancerV2GaugeAddressesGetter,
    @Inject(SingleStakingFarmContractPositionHelper)
    private readonly curveStakingHelper: SingleStakingFarmContractPositionHelper,
  ) {}

  async getPositions() {
    const farms = await this.balancerV2GaugeAddressesGetter.getGauges({ network });
    return await this.curveStakingHelper.getContractPositions<BalancerGauge>({
      network,
      appId,
      groupId,
      dependencies: [
        {
          appId: BALANCER_V2_DEFINITION.id,
          groupIds: [BALANCER_V2_DEFINITION.groups.pool.id],
          network,
        },
      ],
      resolveFarmAddresses: () => farms.map(farm => farm.address),
      resolveFarmContract: ({ address, network }) => this.balancerV2ContractFactory.balancerGauge({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
      resolveRewardTokenAddresses: async () => [],
      resolveRois: async () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
