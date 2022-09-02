import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { SynthetixContractFactory, SynthetixRewards } from '~apps/synthetix';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { YEARN_DEFINITION } from '../yearn.definition';

const appId = YEARN_DEFINITION.id;
const groupId = YEARN_DEFINITION.groups.governance.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumYearnGovernanceContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<SynthetixRewards> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Governance';

  isExcludedFromExplore = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SynthetixRewards {
    return this.contractFactory.synthetixRewards({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return [
      {
        address: '0xba37b002abafdd8e89a1995da52740bbc013d992',
        stakedTokenAddress: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
        rewardTokenAddresses: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8'],
      },
    ];
  }

  async getRewardRates({ contract }: GetDataPropsParams<SynthetixRewards>) {
    return contract.rewardRate();
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<SynthetixRewards>) {
    return contract.balanceOf(address);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<SynthetixRewards>) {
    return contract.rewards(address);
  }
}
