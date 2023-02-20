import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams, UnderlyingTokenDefinition } from '~position/template/app-token.template.types';

import { GearboxContractFactory, PhantomToken } from '../contracts';

@PositionTemplate()
export class EthereumGearboxPhantomTokenFetcher extends AppTokenTemplatePositionFetcher<PhantomToken> {
  groupLabel = 'Phantom Tokens';
  isExcludedFromExplore = true;
  isExcludedFromBalances = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(GearboxContractFactory) private readonly contractFactory: GearboxContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PhantomToken {
    return this.contractFactory.phantomToken({ address, network: this.network });
  }

  // Gearbox requires tokens used as collateral to be ERC20
  async getAddresses(): Promise<string[]> {
    return [
      '0xbac7a431146aeaf3f57a16b9954f332fd292f270', // stkcvx3Crv
      '0xaf314b088b53835d5cf4e4cb81beaba5934a61fe', // stkcvxFRAX3CRV
      '0x34fb99abbafb4e87e256960d572664c6adc301b8', // stkcvxgusd3CRV
      '0xe15b7d80a51e1fe54ac355cabe848efce5289bdb', // stkcvxsteCRV
      '0x7e1992a7f28daa5f6a2d34e2cd40f962f37b172c', // stkcvxcrvPlain3andSUSD
      '0x0a1d4a25d0390899b90bcd22e1ef155003ea76d7', // stkcvxLUSD3CRV
      '0x276187f24d41745513cbe2bd5dfc33a4d8cdc9ed', // stkcvxcrvFRAX
    ];
  }

  async getUnderlyingTokenDefinitions({
    contract,
  }: GetUnderlyingTokensParams<PhantomToken>): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: await contract.underlying(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
