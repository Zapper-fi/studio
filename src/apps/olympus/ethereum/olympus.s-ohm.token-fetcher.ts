import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams } from '~position/template/app-token.template.types';

import { OlympusViemContractFactory } from '../contracts';
import { OlympusSOhmToken } from '../contracts/viem';

@PositionTemplate()
export class EthereumOlympusSOhmTokenFetcher extends AppTokenTemplatePositionFetcher<OlympusSOhmToken> {
  groupLabel = 'sOHM v2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OlympusViemContractFactory) protected readonly contractFactory: OlympusViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.olympusSOhmToken({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x04906695d6d12cf5459975d7c3c03356e4ccd460'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getLiquidity({ appToken, multicall }: GetDataPropsParams<OlympusSOhmToken>) {
    const underlyingToken = appToken.tokens[0];
    const reserveAddress = '0xb63cac384247597756545b500253ff8e607a8020';
    const underlyingTokenContract = this.contractFactory.erc20({
      address: underlyingToken.address,
      network: this.network,
    });

    const reserveRaw = await multicall.wrap(underlyingTokenContract).read.balanceOf([reserveAddress]);
    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    return reserve * underlyingToken.price;
  }

  async getReserves({ appToken, multicall }: GetDataPropsParams<OlympusSOhmToken>) {
    const underlyingToken = appToken.tokens[0];
    const reserveAddress = '0xb63cac384247597756545b500253ff8e607a8020';
    const underlyingTokenContract = this.contractFactory.erc20({
      address: underlyingToken.address,
      network: this.network,
    });

    const reserveRaw = await multicall.wrap(underlyingTokenContract).read.balanceOf([reserveAddress]);
    return [Number(reserveRaw) / 10 ** underlyingToken.decimals];
  }
}
