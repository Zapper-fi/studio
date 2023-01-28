import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams, GetPricePerShareParams } from '~position/template/app-token.template.types';

import { YearnContractFactory, YearnVault } from '../contracts';

import { Y_TOKENS } from './yearn.yield.token-definitions';

@PositionTemplate()
export class EthereumYearnYieldTokenFetcher extends AppTokenTemplatePositionFetcher<YearnVault> {
  groupLabel = 'Yield Tokens';

  constructor(
    @Inject(APP_TOOLKIT) appToolkit: IAppToolkit,
    @Inject(YearnContractFactory)
    private readonly contractFactory: YearnContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YearnVault {
    return this.contractFactory.yearnVault({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return Y_TOKENS.map(yToken => yToken.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<YearnVault>) {
    const match = Y_TOKENS.find(yToken => yToken.address === contract.address.toLowerCase());
    if (!match) throw new Error('Cannot find specified Y token');
    return [{ address: match.underlyingAddress, network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<YearnVault>) {
    return contract
      .getPricePerFullShare()
      .catch(err => {
        if (isMulticallUnderlyingError(err)) return 0;
        throw err;
      })
      .then(pps => [Number(pps) / 10 ** 18]);
  }
}
