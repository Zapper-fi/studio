import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { GetTokenBalancesPerPositionParams } from '~position/template/contract-position.template.position-fetcher';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { PlutusContractFactory, PlutusFarmPlsDpxLp } from '../contracts';
import PLUTUS_DEFINITION from '../plutus.definition';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.farmPlsDpxLp.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusFarmPlsDpxLpContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<PlutusFarmPlsDpxLp> {
  appId = PLUTUS_DEFINITION.id;
  groupId = PLUTUS_DEFINITION.groups.farmPlsDpxLp.id;
  network = Network.ARBITRUM_MAINNET;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly contractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PlutusFarmPlsDpxLp {
    return this.contractFactory.plutusFarmPlsDpxLp({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return [
      {
        address: '0xa61f0d1d831ba4be2ae253c13ff906d9463299c2',
        stakedTokenAddress: '0x16e818e279d7a12ff897e257b397172dcaab323b',
        rewardTokenAddresses: [
          '0x51318b7d00db7acc4026c88c3952b66278b6a67f', // PLS
        ],
      },
    ];
  }

  getRewardRates(contract: PlutusFarmPlsDpxLp) {
    return contract.plsPerSecond();
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesPerPositionParams<PlutusFarmPlsDpxLp>) {
    return contract.userInfo(address).then(v => v.amount);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesPerPositionParams<PlutusFarmPlsDpxLp>) {
    return contract.pendingRewards(address);
  }
}
