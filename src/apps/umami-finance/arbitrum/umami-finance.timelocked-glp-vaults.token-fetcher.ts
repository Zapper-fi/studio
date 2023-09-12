import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
} from '~position/template/app-token.template.types';

import { UmamiFinanceTimelockedGlpVaultAddress } from '../common/umami-finance.constants';
import { UmamiFinanceYieldResolver } from '../common/umami-finance.yield-resolver';
import { UmamiFinanceContractFactory } from '../contracts';
import { UmamiFinanceTimelockedGlpVault } from '../contracts/ethers/UmamiFinanceTimelockedGlpVault';

@PositionTemplate()
export class ArbitrumUmamiFinanceTimelockedGlpVaultsTokenFetcher extends AppTokenTemplatePositionFetcher<UmamiFinanceTimelockedGlpVault> {
  groupLabel = 'Timelocked GLP Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UmamiFinanceYieldResolver)
    private readonly yieldResolver: UmamiFinanceYieldResolver,
    @Inject(UmamiFinanceContractFactory) private readonly umamiFinanceContractFactory: UmamiFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): UmamiFinanceTimelockedGlpVault {
    return this.umamiFinanceContractFactory.umamiFinanceTimelockedGlpVault({
      address,
      network: this.network,
    });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    return [
      UmamiFinanceTimelockedGlpVaultAddress.TL_GLP_USDC,
      UmamiFinanceTimelockedGlpVaultAddress.TL_GLP_WETH,
      UmamiFinanceTimelockedGlpVaultAddress.TL_GLP_WBTC,
      UmamiFinanceTimelockedGlpVaultAddress.TL_GLP_LINK,
      UmamiFinanceTimelockedGlpVaultAddress.TL_GLP_UNI,
    ];
  }

  async getUnderlyingTokenDefinitions({
    contract,
  }: GetUnderlyingTokensParams<UmamiFinanceTimelockedGlpVault>): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({
    contract,
    appToken,
  }: GetPricePerShareParams<UmamiFinanceTimelockedGlpVault>): Promise<number[]> {
    const pricePerShareRaw = await contract.pps();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.decimals;

    return [pricePerShare];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<UmamiFinanceTimelockedGlpVault>): Promise<string> {
    return `Timelocked GLP ${appToken.tokens[0].symbol}`;
  }

  async getImages({ appToken }: GetDisplayPropsParams<UmamiFinanceTimelockedGlpVault>): Promise<string[]> {
    return [getTokenImg(appToken.address, this.network)];
  }

  async getApy({ address }: GetDataPropsParams<UmamiFinanceTimelockedGlpVault>): Promise<number> {
    return this.yieldResolver.getVaultYield(address, true);
  }
}
