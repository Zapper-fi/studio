import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { PenguinViemContractFactory } from '../contracts';
import { PenguinVault } from '../contracts/viem';

@PositionTemplate()
export class AvalanchePenguinVaultClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PenguinVault> {
  groupLabel = 'Compounder Claimable xPEFI';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PenguinViemContractFactory) protected readonly contractFactory: PenguinViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
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
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<PenguinVault>) {
    const rewardBalance = await contract.read.pendingXPefi([address]).catch(err => {
      if (isViemMulticallUnderlyingError(err)) return 0;
      throw err;
    });

    return [rewardBalance];
  }
}
