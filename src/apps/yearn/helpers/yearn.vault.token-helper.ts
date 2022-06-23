import { Inject, Injectable } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { EthersMulticall } from '~multicall';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { YearnContractFactory } from '../contracts';
import { YEARN_DEFINITION } from '../yearn.definition';

import { YearnVaultData, YearnVaultTokenDefinitionsResolver } from './yearn.vault.token-definitions-resolver';

type YearnVaultTokenDataProps = {
  liquidity: number;
  reserve: number;
  isBlocked: boolean;
  apy: number;
};

export type YearnVaultTokenHelperParams = {
  network: Network;
  vaultsToIgnore?: string[];
  dependencies?: AppGroupsDefinition[];
};

@Injectable()
export class YearnVaultTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(YearnContractFactory) private readonly yearnContractFactory: YearnContractFactory,
    @Inject(YearnVaultTokenDefinitionsResolver)
    private readonly tokenDefinitionsResolver: YearnVaultTokenDefinitionsResolver,
  ) {}

  private async resolvePricePerShare({
    vaultDefinition,
    network,
    multicall,
  }: {
    vaultDefinition: YearnVaultData;
    network: Network;
    multicall: EthersMulticall;
  }) {
    if (vaultDefinition.type === 'v2') {
      const contract = this.yearnContractFactory.yearnVaultV2({ address: vaultDefinition.address, network });
      const pricePerShareRaw = await multicall
        .wrap(contract)
        .pricePerShare()
        .catch(() => 0);
      return Number(pricePerShareRaw) / 10 ** vaultDefinition.decimals;
    } else {
      const contract = this.yearnContractFactory.yearnVault({ address: vaultDefinition.address, network });
      const pricePerShareRaw = await multicall
        .wrap(contract)
        .getPricePerFullShare()
        .catch(() => 0);
      return Number(pricePerShareRaw) / 10 ** 18;
    }
  }

  private async getTokens({ network, vaultsToIgnore = [], dependencies = [] }: YearnVaultTokenHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const allTokens = [...appTokens, ...baseTokens];
    const vaultDefinitions = await this.tokenDefinitionsResolver.getVaultDefinitions({ network, vaultsToIgnore });

    const vaultTokens = await Promise.all(
      vaultDefinitions.map(async vault => {
        const underlyingTokenAddress = vault.token.address.toLowerCase();
        const underlyingToken = allTokens.find(t => t.address === underlyingTokenAddress);
        if (!underlyingToken) return null;

        const type = ContractType.APP_TOKEN;
        const appId = YEARN_DEFINITION.id;
        const groupId = vault.type === 'v1' ? YEARN_DEFINITION.groups.v1Vault.id : YEARN_DEFINITION.groups.v2Vault.id;
        const vaultAddress = vault.address.toLowerCase();
        const erc20Contract = this.yearnContractFactory.erc20({ address: vaultAddress, network });

        const [symbol, decimals, supplyRaw, pricePerShare] = await Promise.all([
          multicall.wrap(erc20Contract).symbol(),
          multicall.wrap(erc20Contract).decimals(),
          multicall.wrap(erc20Contract).totalSupply(),
          this.resolvePricePerShare({ vaultDefinition: vault, multicall, network }),
        ]);

        // Data props
        const supply = Number(supplyRaw) / 10 ** decimals;
        const reserve = pricePerShare * supply;
        const price = underlyingToken.price * pricePerShare;
        const tokens = [underlyingToken];
        const liquidity = price * supply;
        const apy = vault.apy?.net_apy;
        const isBlocked = vault.emergencyShutdown || vault.type === 'v1' || vault.migration?.available;

        // Display props
        const label = getLabelFromToken(underlyingToken);
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = getImagesFromToken(underlyingToken);
        const statsItems = [
          { label: 'APY', value: buildPercentageDisplayItem(apy) },
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
        ];

        const vaultToken: AppTokenPosition<YearnVaultTokenDataProps> = {
          address: vaultAddress,
          type,
          network,
          appId,
          groupId,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            liquidity,
            reserve,
            isBlocked: !!isBlocked,
            apy,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },
        };

        return vaultToken;
      }),
    );

    return compact(vaultTokens).filter(v => v.price > 0 && v.dataProps.liquidity > 1000);
  }

  async getV1Tokens(opts: YearnVaultTokenHelperParams) {
    const tokens = await this.getTokens(opts);
    return tokens.filter(t => t.groupId === YEARN_DEFINITION.groups.v1Vault.id);
  }

  async getV2Tokens(opts: YearnVaultTokenHelperParams) {
    const tokens = await this.getTokens(opts);
    return tokens.filter(t => t.groupId === YEARN_DEFINITION.groups.v2Vault.id);
  }
}
