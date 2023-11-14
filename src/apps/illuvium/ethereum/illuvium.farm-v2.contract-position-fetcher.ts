import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenDefinitionsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmDynamicTemplateContractPositionFetcher } from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { IlluviumViemContractFactory } from '../contracts';
import { IlluviumIlvPoolV2 } from '../contracts/viem';

@PositionTemplate()
export class EthereumIlluviumFarmV2ContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<IlluviumIlvPoolV2> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(IlluviumViemContractFactory) protected readonly contractFactory: IlluviumViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.illuviumIlvPoolV2({ address, network: this.network });
  }

  getFarmAddresses() {
    return ['0x7f5f854ffb6b7701540a00c69c4ab2de2b34291d', '0xe98477bdc16126bb0877c6e3882e3edd72571cc2'];
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<IlluviumIlvPoolV2>) {
    return contract.read.poolToken();
  }

  async getRewardTokenAddresses() {
    return '0x767fe9edc9e0df98e07454847909b5e959d7ca0e';
  }

  async getRewardRates() {
    return 0;
  }

  async getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<IlluviumIlvPoolV2>) {
    return contract.read.balanceOf([address]);
  }

  async getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<IlluviumIlvPoolV2>) {
    return (await contract.read.pendingRewards([address]))[0];
  }
}
