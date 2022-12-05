import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { GetPricePerShareParams } from '~position/template/app-token.template.types';

import { YearnVaultTokenDefinitionsResolver } from '../common/yearn.vault.token-definitions-resolver';
import { YearnVaultTokenFetcher } from '../common/yearn.vault.token-fetcher';
import { YearnContractFactory, YearnVault } from '../contracts';

export abstract class YearnV1VaultTokenFetcher extends YearnVaultTokenFetcher<YearnVault> {
  vaultType = 'v1' as const;

  constructor(
    @Inject(YearnContractFactory) private readonly contractFactory: YearnContractFactory,
    @Inject(YearnVaultTokenDefinitionsResolver)
    tokenDefinitionsResolver: YearnVaultTokenDefinitionsResolver,
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
  ) {
    super(appToolkit, tokenDefinitionsResolver);
  }

  getContract(address: string): YearnVault {
    return this.contractFactory.yearnVault({ network: this.network, address });
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<YearnVault>) {
    const pricePerShareRaw = await contract.getPricePerFullShare().catch(err => {
      if (isMulticallUnderlyingError(err)) return 0;
      throw err;
    });
    return Number(pricePerShareRaw) / 10 ** 18;
  }
}
