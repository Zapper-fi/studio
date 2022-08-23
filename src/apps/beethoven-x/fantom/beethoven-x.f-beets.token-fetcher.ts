import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetPricePerShareStageParams,
  GetUnderlyingTokensStageParams,
} from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';
import { BeethovenXContractFactory } from '../contracts';
import { BeethovenXBeetsBar } from '../contracts/ethers/BeethovenXBeetsBar';

const appId = BEETHOVEN_X_DEFINITION.id;
const groupId = BEETHOVEN_X_DEFINITION.groups.fBeets.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomBeethovenXFBeetsTokenFetcher extends AppTokenTemplatePositionFetcher<BeethovenXBeetsBar> {
  appId = BEETHOVEN_X_DEFINITION.id;
  groupId = BEETHOVEN_X_DEFINITION.groups.fBeets.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeethovenXContractFactory) protected readonly contractFactory: BeethovenXContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    return ['0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1'];
  }

  getContract(address: string): BeethovenXBeetsBar {
    return this.contractFactory.beethovenXBeetsBar({ address, network: this.network });
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensStageParams<BeethovenXBeetsBar>) {
    return contract.vestingToken();
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareStageParams<BeethovenXBeetsBar>) {
    const underlying = appToken.tokens[0];
    const underlyingTokenContract = this.contractFactory.erc20({ address: underlying.address, network: this.network });
    const reserveRaw = await multicall.wrap(underlyingTokenContract).balanceOf(appToken.address);
    const reserve = Number(reserveRaw) / 10 ** underlying.decimals;
    return reserve / appToken.supply;
  }
}
