import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { OlympusContractFactory, OlympusGOhmToken } from '../contracts';

@PositionTemplate()
export class EthereumOlympusGOhmTokenFetcher extends AppTokenTemplatePositionFetcher<OlympusGOhmToken> {
  groupLabel = 'gOHM';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OlympusContractFactory) protected readonly contractFactory: OlympusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): OlympusGOhmToken {
    return this.contractFactory.olympusGOhmToken({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x0ab87046fbb341d058f17cbc4c1133f25a20a52f'];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<OlympusGOhmToken>) {
    return [await contract.sOHM()];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<OlympusGOhmToken>) {
    const oneOhm = BigNumber.from(1).mul(10).pow(appToken.tokens[0].decimals);
    const [gOhmDecimalsRaw, gOhmConvertedAmountRaw] = await Promise.all([
      contract.decimals(),
      contract.balanceTo(oneOhm),
    ]);

    const convertedAmount = Number(gOhmConvertedAmountRaw) / 10 ** gOhmDecimalsRaw;
    const pricePerShare = 1 / convertedAmount;
    return [pricePerShare];
  }

  async getLiquidity({ appToken, multicall }: GetDataPropsParams<OlympusGOhmToken>) {
    const underlyingToken = appToken.tokens[0];
    const reserveAddress = '0xb63cac384247597756545b500253ff8e607a8020';
    const underlyingTokenContract = this.contractFactory.erc20({
      address: underlyingToken.address,
      network: this.network,
    });

    const reserveRaw = await multicall.wrap(underlyingTokenContract).balanceOf(reserveAddress);
    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    return reserve * underlyingToken.price;
  }

  async getReserves({ appToken, multicall }: GetDataPropsParams<OlympusGOhmToken>) {
    const underlyingToken = appToken.tokens[0];
    const reserveAddress = '0xb63cac384247597756545b500253ff8e607a8020';
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
