import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { AsdCrv, ConcentratorContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumConcentratorAsdCrvTokenFetcher extends AppTokenTemplatePositionFetcher<AsdCrv> {
  groupLabel = 'asdCRV';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) protected readonly contractFactory: ConcentratorContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AsdCrv {
    return this.contractFactory.asdCrv({ address, network: this.network });
  }

  getAddresses() {
    return ['0x43e54c2e7b3e294de3a155785f52ab49d87b9922'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<AsdCrv>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<AsdCrv>) {
    const supply = Number(await contract.totalSupply());
    const reserve = Number(await contract.totalAssets());
    return [reserve / supply];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<AsdCrv>) {
    return appToken.supply * appToken.price;
  }
}
