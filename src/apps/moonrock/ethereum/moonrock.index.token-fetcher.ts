import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { MoonrockViemContractFactory } from '../contracts';
import { MoonrockToken } from '../contracts/viem';

@PositionTemplate()
export class EthereumMoonrockIndexTokenFetcher extends AppTokenTemplatePositionFetcher<MoonrockToken> {
  groupLabel = 'Index';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MoonrockViemContractFactory) protected readonly contractFactory: MoonrockViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.moonrockToken({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return [
      '0x02e7ac540409d32c90bfb51114003a9e1ff0249c', // JPG
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<MoonrockToken>) {
    return (await contract.read.getComponents()).map(address => ({ address, network: this.network }));
  }

  async getPricePerShare({ appToken, contract }: GetDataPropsParams<MoonrockToken>) {
    const pricePerShare = await Promise.all(
      appToken.tokens.map(async underlyingToken => {
        const ratio = await contract.read.getTotalComponentRealUnits([underlyingToken.address]);
        return Number(ratio) / 10 ** underlyingToken.decimals;
      }),
    );

    return pricePerShare;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<MoonrockToken>) {
    return appToken.symbol;
  }
}
