import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { PenguinContractFactory, PenguinVault } from '../contracts';

@PositionTemplate()
export class AvalanchePenguinVaultClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PenguinVault> {
  groupLabel = 'Compounder Claimable xPEFI';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PenguinContractFactory) protected readonly contractFactory: PenguinContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PenguinVault {
    return this.contractFactory.penguinVault({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0xd79a36056c271b988c5f1953e664e61416a9820f' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: '0xd79a36056c271b988c5f1953e664e61416a9820f',
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PenguinVault>) {
    return `Claimable ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<PenguinVault>) {
    const rewardBalance = await contract.pendingXPefi(address).catch(err => {
      if (isMulticallUnderlyingError(err)) return 0;
      throw err;
    });

    return [rewardBalance];
  }
}
