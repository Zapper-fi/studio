import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { PikaProtocolViemContractFactory } from '../contracts';
import { PikaProtocolVester } from '../contracts/viem';

@PositionTemplate()
export class OptimismPikaProtocolEscrowContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PikaProtocolVester> {
  groupLabel = 'Vest Escrow';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PikaProtocolViemContractFactory) private readonly contractFactory: PikaProtocolViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pikaProtocolVester({ network: this.network, address });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x21a4a5c00ab2fd749ebec8282456d93351459f2a' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<PikaProtocolVester>) {
    return [
      {
        metaType: MetaType.LOCKED,
        address: await contract.read.esPika(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PikaProtocolVester>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<PikaProtocolVester>): Promise<BigNumberish[]> {
    const lockedBalance = await contract.read.depositedAll([address]);

    return [lockedBalance];
  }
}
