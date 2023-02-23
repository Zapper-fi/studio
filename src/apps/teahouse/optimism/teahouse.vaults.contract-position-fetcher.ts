import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { TeahouseVault, TeahouseContractFactory } from '../contracts';

@PositionTemplate()
export class OptimismTeahouseVaultsContractPositionFetcher extends ContractPositionTemplatePositionFetcher<TeahouseVault> {
  groupLabel = 'Vault';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TeahouseContractFactory) private readonly contractFactory: TeahouseContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TeahouseVault {
    return this.contractFactory.teahouseVault({ network: this.network, address });
  }

  async getDefinitions() {
    return [
      { address: '0x9ae039f9de94542f6f1b3fba60223e6aa4f411af' },
      { address: '0xee1e02609a480bdc9d9651c200d90222b6691f03' },
    ];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<TeahouseVault>) {
    return [
      {
        address: await contract.asset(),
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel({ contract }) {
    return await contract.name();
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<TeahouseVault>): Promise<BigNumberish[]> {
    const userState = await contract.userState(address);
    const balance = await contract.balanceOf(address);
    const requestedDeposits = userState.requestedDeposits;
    return [balance.add(requestedDeposits)];
  }
}
