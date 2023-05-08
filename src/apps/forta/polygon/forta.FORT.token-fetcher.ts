import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { FortaContractFactory, Fort } from '../contracts';
import { Contract } from 'ethers';

@PositionTemplate()
export class PolygonFortFortTokenFetcher extends AppTokenTemplatePositionFetcher<Fort> {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(FortaContractFactory) private readonly fortaContractFactory: FortaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Fort {
    return this.fortaContractFactory.fort({ address, network: this.network });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    return ['0x9ff62d1fc52a907b6dcba8077c2ddca6e6a9d3e1', '0x41545f8b9472d758bb669ed8eaeeecd7a9c4ec29'];
  }

  async getPricePerShare() {
    return [1];
  }
}
