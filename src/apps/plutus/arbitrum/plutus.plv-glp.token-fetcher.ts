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

import { PlutusContractFactory } from '../contracts';
import { PlutusPlvGlp } from '../contracts/ethers/PlutusPlvGlp';

type PlutusPlvGlpTokenDataProps = {
  reserve: number;
  liquidity: number;
};

@PositionTemplate()
export class ArbitrumPlutusPlvGlpTokenFetcher extends AppTokenTemplatePositionFetcher<
  PlutusPlvGlp,
  PlutusPlvGlpTokenDataProps
> {
  groupLabel = 'plvGLP';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly contractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PlutusPlvGlp {
    return this.contractFactory.plutusPlvGlp({ address, network: this.network });
  }

  getAddresses() {
    return ['0x5326e71ff593ecc2cf7acae5fe57582d6e74cff1'];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<PlutusPlvGlp>) {
    return contract.asset();
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<PlutusPlvGlp>) {
    const pricePerShareRaw = await contract.convertToAssets(BigNumber.from(10).pow(18).toString());
    return Number(pricePerShareRaw) / 10 ** 18;
  }

  async getDataProps({ appToken, contract }: GetDataPropsParams<PlutusPlvGlp>) {
    const reserveRaw = await contract.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const liquidity = reserve * appToken.tokens[0].price;
    return { reserve, liquidity };
  }
}
