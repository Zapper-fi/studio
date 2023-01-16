import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { GainsNetworkContractFactory, GainsNetworkGToken } from '../contracts';

@PositionTemplate()
export class PolygonGainsNetworkGTokenTokenFetcher extends AppTokenTemplatePositionFetcher<GainsNetworkGToken> {
  groupLabel = 'gTokens';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GainsNetworkContractFactory) protected readonly contractFactory: GainsNetworkContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GainsNetworkGToken {
    return this.contractFactory.gainsNetworkGToken({ network: this.network, address });
  }

  async getAddresses() {
    return ['0x91993f2101cc758d0deb7279d41e880f7defe827'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<GainsNetworkGToken>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<GainsNetworkGToken>) {
    const oneUnit = ethers.BigNumber.from(10).pow(18);
    const pricePerShareWar = await contract.convertToShares(oneUnit);
    const pricePerShare = Number(pricePerShareWar) / 10 ** appToken.decimals;

    return [pricePerShare];
  }
}
