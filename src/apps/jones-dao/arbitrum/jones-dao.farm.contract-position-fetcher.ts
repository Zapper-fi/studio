import { Inject } from '@nestjs/common';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { SynthetixSingleStakingIsActiveStrategy, SynthetixSingleStakingRoiStrategy } from '~apps/synthetix';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { JonesDaoContractFactory, JonesStakingRewards } from '../contracts';
import { JONES_DAO_DEFINITION } from '../jones-dao.definition';

const appId = JONES_DAO_DEFINITION.id;
const groupId = JONES_DAO_DEFINITION.groups.farm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumJonesDaoFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(JonesDaoContractFactory)
    private readonly jonesDaoContractFactory: JonesDaoContractFactory,
    @Inject(SynthetixSingleStakingIsActiveStrategy)
    private readonly synthetixSingleStakingIsActiveStrategy: SynthetixSingleStakingIsActiveStrategy,
    @Inject(SynthetixSingleStakingRoiStrategy)
    private readonly synthetixSingleStakingRoiStrategy: SynthetixSingleStakingRoiStrategy,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const factoryAddress = '0x2c2082e4062bfd02141adc86cbd5e437201a1cf3';
    const factory = this.jonesDaoContractFactory.jonesStakingRewardsFactory({ address: factoryAddress, network });
    const mcf = multicall.wrap(factory);

    const maybeStakingIds = await Promise.all(range(0, 50).map(i => mcf.stakingID(i).catch(() => null)));
    const stakingIds = compact(maybeStakingIds).map(v => Number(v));
    const stakingInfo = await Promise.all(stakingIds.map(i => mcf.stakingRewardsInfoByStakingToken(i)));
    const stakingAddresses = stakingInfo.map(v => v.stakingRewards);

    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<JonesStakingRewards>({
      network,
      appId,
      groupId,
      dependencies: [{ appId: 'sushiswap', groupIds: ['pool'], network }],
      resolveFarmContract: ({ network, address }) =>
        this.jonesDaoContractFactory.jonesStakingRewards({ network, address }),
      resolveFarmAddresses: async () => stakingAddresses,
      resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).stakingToken(),
      resolveRewardTokenAddresses: async () => '0x10393c20975cf177a3513071bc110f7962cd67da',
      resolveIsActive: this.synthetixSingleStakingIsActiveStrategy.build({
        resolvePeriodFinish: ({ contract, multicall }) => multicall.wrap(contract).periodFinish(),
      }),
      resolveRois: this.synthetixSingleStakingRoiStrategy.build({
        resolveRewardRates: ({ contract, multicall }) => multicall.wrap(contract).rewardRateJONES(),
      }),
    });
  }
}
