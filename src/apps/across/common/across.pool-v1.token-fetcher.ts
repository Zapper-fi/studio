import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { AcrossContractFactory } from '../contracts';
import { AcrossPoolV1 } from '../contracts/ethers/AcrossPoolV1';

export abstract class AcrossPoolV1TokenFetcher extends AppTokenTemplatePositionFetcher<AcrossPoolV1> {
  abstract poolAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AcrossContractFactory) protected readonly contractFactory: AcrossContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AcrossPoolV1 {
    return this.contractFactory.acrossPoolV1({ network: this.network, address });
  }

  async getAddresses() {
    return this.poolAddresses;
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<AcrossPoolV1>) {
    return [{ address: await contract.l1Token(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken, multicall }: GetPricePerShareParams<AcrossPoolV1>) {
    const pricePerShareRaw = await multicall.wrap(contract).callStatic.exchangeRateCurrent();
    const decimals = appToken.tokens[0].decimals;
    return [Number(pricePerShareRaw) / 10 ** decimals];
  }

  async getLiquidity({ contract, appToken }: GetDataPropsParams<AcrossPoolV1>) {
    const reserveRaw = await contract.liquidReserves();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return reserve * appToken.tokens[0].price;
  }

  async getReserves({ contract, appToken }: GetDataPropsParams<AcrossPoolV1>) {
    const reserveRaw = await contract.liquidReserves();
    return [Number(reserveRaw) / 10 ** appToken.tokens[0].decimals];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<AcrossPoolV1>): Promise<string> {
    return `${getLabelFromToken(appToken.tokens[0])} Pool (deprecated)`;
  }
}
