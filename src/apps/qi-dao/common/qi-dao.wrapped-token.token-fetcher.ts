import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { QiDaoContractFactory, QiDaoWrappedToken } from '../contracts';

export abstract class WrappedTokenTokenFetcher extends AppTokenTemplatePositionFetcher<QiDaoWrappedToken> {
  groupLabel = 'Wrapped Tokens';

  isExcludedFromBalances = true;
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(QiDaoContractFactory) private readonly contractFactory: QiDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): QiDaoWrappedToken {
    return this.contractFactory.qiDaoWrappedToken({ network: this.network, address });
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<QiDaoWrappedToken>) {
    return [{ address: await contract.token(), network: this.network }];
  }
  async getPricePerShare({ contract, appToken, multicall }: GetPricePerShareParams<QiDaoWrappedToken>) {
    const oneUnit = BigNumber.from(10).pow(18);
    const pricePerShareRaw = await multicall.wrap(contract).calculateUnderlying(oneUnit);
    const decimals = appToken.tokens[0].decimals;
    return [Number(pricePerShareRaw) / 10 ** decimals];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<QiDaoWrappedToken>) {
    return getLabelFromToken(appToken.tokens[0]);
  }
}
