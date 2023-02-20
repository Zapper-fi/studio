import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { Api3ContractFactory, Api3Staking } from '../contracts';

@PositionTemplate()
export class EthereumApi3StakingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Api3Staking> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(Api3ContractFactory) protected readonly contractFactory: Api3ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Api3Staking {
    return this.contractFactory.api3Staking({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x6dd655f10d4b9e242ae186d9050b68f725c76d76' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<Api3Staking>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.api3Token(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<Api3Staking>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<Api3Staking>) {
    return [await contract.userStake(address)];
  }
}
