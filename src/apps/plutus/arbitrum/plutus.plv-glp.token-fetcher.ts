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

import { PlutusViemContractFactory } from '../contracts';
import { PlutusPlvGlp } from '../contracts/viem/PlutusPlvGlp';

@PositionTemplate()
export class ArbitrumPlutusPlvGlpTokenFetcher extends AppTokenTemplatePositionFetcher<PlutusPlvGlp> {
  groupLabel = 'plvGLP';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusViemContractFactory) protected readonly contractFactory: PlutusViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PlutusPlvGlp {
    return this.contractFactory.plutusPlvGlp({ address, network: this.network });
  }

  getAddresses() {
    return ['0x5326e71ff593ecc2cf7acae5fe57582d6e74cff1'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<PlutusPlvGlp>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<PlutusPlvGlp>) {
    const pricePerShareRaw = await contract.convertToAssets(BigNumber.from(10).pow(18).toString());
    const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
    return [pricePerShare];
  }

  async getLiquidity({ appToken, contract }: GetDataPropsParams<PlutusPlvGlp>) {
    const reserveRaw = await contract.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const liquidity = reserve * appToken.tokens[0].price;
    return liquidity;
  }

  async getReserves({ appToken, contract }: GetDataPropsParams<PlutusPlvGlp>) {
    const reserveRaw = await contract.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve];
  }
}
