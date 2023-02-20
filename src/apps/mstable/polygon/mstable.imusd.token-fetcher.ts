import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { MstableContractFactory } from '../contracts';
import { MstableAsset } from '../contracts/ethers';

@PositionTemplate()
export class PolygonMstableImusdTokenFetcher extends AppTokenTemplatePositionFetcher<MstableAsset> {
  groupLabel = 'imUSD';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MstableContractFactory) protected readonly contractFactory: MstableContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): MstableAsset {
    return this.contractFactory.mstableAsset({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x5290ad3d83476ca6a2b178cd9727ee1ef72432af'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<MstableAsset>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<MstableAsset>) {
    return [await contract.exchangeRate().then(v => Number(v) / 10 ** appToken.tokens[0].decimals)];
  }
}
