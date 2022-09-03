import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { GetDataPropsParams, GetPricePerShareParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { YearnContractFactory, YearnVault } from '../contracts';
import { YearnVaultTokenDefinitionsResolver } from '../helpers/yearn.vault.token-definitions-resolver';
import { YearnVaultTokenDataProps, YearnVaultTokenFetcher } from '../helpers/yearn.vault.token-fetcher';
import { YEARN_DEFINITION } from '../yearn.definition';

@Injectable()
export class EthereumYearnV1VaultTokenFetcher extends YearnVaultTokenFetcher<YearnVault> {
  appId = YEARN_DEFINITION.id;
  groupId = YEARN_DEFINITION.groups.v1Vault.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'V1 Vaults';

  vaultType = 'v1' as const;
  vaultsToIgnore = ['0xc5bddf9843308380375a611c18b50fb9341f502a'];

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

  async getDataProps(
    opts: GetDataPropsParams<YearnVault, YearnVaultTokenDataProps>,
  ): Promise<YearnVaultTokenDataProps> {
    const { appToken } = opts;
    const vault = await this.selectVault(appToken.address);
    if (!vault) throw new Error('Cannot find specified vault');

    const liquidity = appToken.price * appToken.supply;
    const apy = vault.apy?.net_apy * 100;
    const isBlocked = true; // all v1 vaults are considered as blocked
    const reserve = appToken.pricePerShare[0] * appToken.supply;

    return { liquidity, apy, isBlocked, reserve };
  }
}
