import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { GetDataPropsParams, GetPricePerShareParams } from '~position/template/app-token.template.types';

import { YearnVaultTokenDefinitionsResolver } from '../common/yearn.vault.token-definitions-resolver';
import { YearnVaultTokenDataProps, YearnVaultTokenFetcher } from '../common/yearn.vault.token-fetcher';
import { YearnContractFactory, YearnVaultV2 } from '../contracts';

export abstract class YearnV2VaultTokenFetcher extends YearnVaultTokenFetcher<YearnVaultV2> {
  vaultType = 'v2' as const;

  constructor(
    @Inject(YearnContractFactory) private readonly contractFactory: YearnContractFactory,
    @Inject(YearnVaultTokenDefinitionsResolver)
    tokenDefinitionsResolver: YearnVaultTokenDefinitionsResolver,
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
  ) {
    super(appToolkit, tokenDefinitionsResolver);
  }

  getContract(address: string): YearnVaultV2 {
    return this.contractFactory.yearnVaultV2({ network: this.network, address });
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<YearnVaultV2>) {
    const pricePerShareRaw = await contract.pricePerShare().catch(err => {
      if (isMulticallUnderlyingError(err)) return 0;
      throw err;
    });
    return Number(pricePerShareRaw) / 10 ** appToken.decimals;
  }

  async getDataProps(
    opts: GetDataPropsParams<YearnVaultV2, YearnVaultTokenDataProps>,
  ): Promise<YearnVaultTokenDataProps> {
    const { appToken } = opts;
    const vault = await this.selectVault(appToken.address);
    if (!vault) throw new Error('Cannot find specified vault');

    const liquidity = appToken.price * appToken.supply;
    const apy = vault.apy?.net_apy;
    const isBlocked = !!(vault.emergencyShutdown || vault.migration?.available);
    const reserve = appToken.pricePerShare[0] * appToken.supply;

    return { liquidity, apy, isBlocked, reserve };
  }
}
