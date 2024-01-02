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

import { SiloFinanceViemContractFactory } from '../contracts';
import { SiloStipController } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumSiloFinanceClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<SiloStipController> {
  groupLabel = 'Claimables';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SiloFinanceViemContractFactory) protected readonly contractFactory: SiloFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.siloStipController({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0xd592f705bdc8c1b439bd4d665ed99c4faad5a680' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<SiloStipController>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.read.REWARD_TOKEN(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SiloStipController>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<SiloStipController>) {
    return [await contract.read.getUserUnclaimedRewards([address])];
  }
}
