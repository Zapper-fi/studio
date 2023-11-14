import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { MakerViemContractFactory } from '../contracts';
import { MakerMdcPot } from '../contracts/viem';

@PositionTemplate()
export class EthereumMakerDsrContractPositionFetcher extends ContractPositionTemplatePositionFetcher<MakerMdcPot> {
  groupLabel = 'DSR';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MakerViemContractFactory) protected readonly contractFactory: MakerViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.makerMdcPot({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x197e90f9fad81970ba7976f33cbd77088e5d7cf7' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0x83f20f44975d03b1b09e64809b757c47f942beea',
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<MakerMdcPot>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<MakerMdcPot>) {
    return [await contract.read.pie([address])];
  }
}
