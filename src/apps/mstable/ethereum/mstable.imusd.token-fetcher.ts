import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { MstableViemContractFactory } from '../contracts';
import { MstableAsset } from '../contracts/ethers';

@PositionTemplate()
export class EthereumMstableImusdTokenFetcher extends AppTokenTemplatePositionFetcher<MstableAsset> {
  groupLabel = 'imUSD';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MstableViemContractFactory) protected readonly contractFactory: MstableViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.mstableAsset({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x30647a72dc82d7fbb1123ea74716ab8a317eac19'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<MstableAsset>) {
    return [{ address: await contract.read.asset(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<MstableAsset>) {
    return [await contract.read.exchangeRate().then(v => Number(v) / 10 ** appToken.tokens[0].decimals)];
  }
}
