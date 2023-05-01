import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { GroContractFactory, GroLabsVault } from '../contracts';

@PositionTemplate()
export class AvalancheGroLabsTokenFetcher extends AppTokenTemplatePositionFetcher<GroLabsVault> {
  groupLabel = 'Labs';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GroContractFactory) private readonly contractFactory: GroContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GroLabsVault {
    return this.contractFactory.groLabsVault({ network: this.network, address });
  }

  async getAddresses() {
    return [
      '0x6063597b9356b246e706fd6a48c780f897e3ef55',
      '0x2eb05cffa24309b9aaf300392a4d8db745d4e592',
      '0x6ef44077a1f5e10cdfccc30efb7dcdb1d5475581',
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<GroLabsVault>) {
    return [{ address: await contract.token(), network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<GroLabsVault>) {
    const pricePerShareRaw = await contract.getPricePerShare();
    return [Number(pricePerShareRaw) / 10 ** 18];
  }
}
