import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmDynamicTemplateContractPositionFetcher } from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { MakerViemContractFactory } from '../contracts';
import { MakerGovernance } from '../contracts/viem';

@PositionTemplate()
export class EthereumMakerGovernanceContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<MakerGovernance> {
  groupLabel = 'Governance';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MakerViemContractFactory) protected readonly contractFactory: MakerViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.makerGovernance({ address, network: this.network });
  }

  getFarmAddresses() {
    return ['0x9ef05f7f6deb616fd37ac3c959a2ddd25a54e4f5'];
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<MakerGovernance>) {
    return contract.read.GOV();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<MakerGovernance>) {
    return [await contract.read.GOV()];
  }

  async getRewardRates() {
    return [0];
  }

  async getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<MakerGovernance>) {
    return contract.read.deposits([address]);
  }

  async getRewardTokenBalances() {
    return [0];
  }
}
