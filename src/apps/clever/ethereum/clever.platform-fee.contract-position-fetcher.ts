import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { CleverViemContractFactory } from '../contracts';
import { CleverFeeDistributor } from '../contracts/viem/CleverFeeDistributor';

@PositionTemplate()
export class EthereumCleverPlatformFeeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<CleverFeeDistributor> {
  groupLabel = 'Platform fees';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CleverViemContractFactory) protected readonly contractFactory: CleverViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.cleverFeeDistributor({ address, network: this.network });
  }

  async getDefinitions() {
    return [
      { address: '0x261e3aeb4cd1ebfd0fa532d6acdd4b21ebdcd2de' }, // CVX
      { address: '0xb5e7f9cb9d3897808658f1991ad32912959b42e2' }, // FRAX
    ];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<CleverFeeDistributor>) {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.read.token(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<CleverFeeDistributor>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<CleverFeeDistributor>) {
    const { result: claimableAmount } = await contract.simulate.claim([address]);
    return [claimableAmount];
  }
}
