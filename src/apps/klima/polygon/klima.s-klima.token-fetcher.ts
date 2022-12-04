import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams } from '~position/template/app-token.template.types';

import { KlimaContractFactory, KlimaSKlima } from '../contracts';

@PositionTemplate()
export class PolygonKlimaSTokenFetcher extends AppTokenTemplatePositionFetcher<KlimaSKlima> {
  groupLabel = 'sKLIMA';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KlimaContractFactory) protected readonly contractFactory: KlimaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): KlimaSKlima {
    return this.contractFactory.klimaSKlima({ address, network: this.network });
  }

  async getAddresses() {
    return ['0xb0c22d8d350c67420f06f48936654f567c73e8c8'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0x4e78011ce80ee02d2c3e649fb657e45898257815'];
  }

  async getPricePerShare() {
    return [1];
  }

  async getLiquidity({ appToken, multicall }: GetDataPropsParams<KlimaSKlima>) {
    const underlyingToken = appToken.tokens[0];
    const reserveAddress = '0x25d28a24ceb6f81015bb0b2007d795acac411b4d';
    const underlyingTokenContract = this.contractFactory.erc20({
      address: underlyingToken.address,
      network: this.network,
    });

    const reserveRaw = await multicall.wrap(underlyingTokenContract).balanceOf(reserveAddress);
    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    return reserve * underlyingToken.price;
  }

  async getReserves({ appToken, multicall }: GetDataPropsParams<KlimaSKlima>) {
    const underlyingToken = appToken.tokens[0];
    const reserveAddress = '0x25d28a24ceb6f81015bb0b2007d795acac411b4d';
    const underlyingTokenContract = this.contractFactory.erc20({
      address: underlyingToken.address,
      network: this.network,
    });

    const reserveRaw = await multicall.wrap(underlyingTokenContract).balanceOf(reserveAddress);
    return [Number(reserveRaw) / 10 ** underlyingToken.decimals];
  }

  async getApy() {
    return 0;
  }
}
