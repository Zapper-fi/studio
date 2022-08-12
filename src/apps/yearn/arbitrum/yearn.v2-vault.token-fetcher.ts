import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { DataPropsStageParams, PricePerShareStageParams } from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { YearnContractFactory, YearnVaultV2 } from '../contracts';
import { YearnVaultTokenDefinitionsResolver } from '../helpers/yearn.vault.token-definitions-resolver';
import { YearnVaultTokenDataProps, YearnVaultTokenFetcher } from '../helpers/yearn.vault.token-fetcher';
import { YEARN_DEFINITION } from '../yearn.definition';

const appId = YEARN_DEFINITION.id;
const groupId = YEARN_DEFINITION.groups.v2Vault.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumYearnV2VaultTokenFetcher extends YearnVaultTokenFetcher<YearnVaultV2> {
  appId = appId;
  groupId = groupId;
  network = network;

  vaultType = 'v2' as const;
  vaultsToIgnore = [];

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

  async getPricePerShare({ contract, appToken }: PricePerShareStageParams<YearnVaultV2>) {
    const pricePerShareRaw = await contract.pricePerShare().catch(() => 0);
    return Number(pricePerShareRaw) / 10 ** appToken.decimals;
  }

  async getDataProps(
    opts: DataPropsStageParams<YearnVaultV2, YearnVaultTokenDataProps>,
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
