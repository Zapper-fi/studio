import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact } from 'lodash';

import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { EthersMulticall } from '~multicall';
import { ContractType } from '~position/contract.interface';
import { StatsItem } from '~position/display.interface';
import { AppTokenPosition, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { YearnContractFactory, YearnVault } from '../contracts';

type YearnVaultTokenDataProps = {
  liquidity: number;
  reserve: number;
};

export type YearnVaultTokenHelperParams<T> = {
  network: Network;
  appId: string;
  groupId: string;
  dependencies?: AppGroupsDefinition[];
  resolvePrimaryLabel?: (opts: { symbol: string; vaultAddress: string; underlyingToken: Token }) => string;
  resolveVaultAddresses: (opts: { multicall: EthersMulticall; network: Network }) => Promise<string[]>;
  resolveContract?: (opts: { address: string; network: Network }) => T;
  resolveUnderlyingToken?: (opts: { multicall: EthersMulticall; contract: T }) => Promise<string>;
  resolvePricePerShare?: (opts: { multicall: EthersMulticall; contract: T }) => Promise<BigNumberish>;
  resolvePricePerShareActual?: (opts: { pricePerShareRaw: BigNumberish; decimals: number }) => number;
  resolveApy?: (opts: { vaultAddress: string; multicall: EthersMulticall; contract: T }) => Promise<number>;
};

@Injectable()
export class YearnLikeVaultTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(YearnContractFactory) private readonly yearnContractFactory: YearnContractFactory,
  ) {}

  async getTokens<T = YearnVault>({
    network,
    appId,
    groupId,
    dependencies = [],
    resolveVaultAddresses,
    resolveContract = ({ address, network }) =>
      this.yearnContractFactory.yearnVault({ address, network }) as unknown as T,
    resolvePrimaryLabel = ({ underlyingToken }) => `${getLabelFromToken(underlyingToken)} Vault`,
    resolveUnderlyingToken = ({ contract, multicall }) => multicall.wrap(contract as unknown as YearnVault).token(),
    resolvePricePerShare = ({ contract, multicall }) =>
      multicall.wrap(contract as unknown as YearnVault).getPricePerFullShare(),
    resolvePricePerShareActual = ({ pricePerShareRaw, decimals }) => Number(pricePerShareRaw) / 10 ** decimals,
    resolveApy,
  }: YearnVaultTokenHelperParams<T>) {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const allTokens = [...appTokens, ...baseTokens];
    const vaultAddresses = await resolveVaultAddresses({ multicall, network });

    const curvePoolTokens = await Promise.all(
      vaultAddresses.map(async vaultAddress => {
        const type = ContractType.APP_TOKEN;
        const erc20Contract = this.yearnContractFactory.erc20({ address: vaultAddress, network });
        const vaultContract = resolveContract({ address: vaultAddress, network });

        const [symbol, decimals, supplyRaw, underlyingTokenAddressRaw, pricePerShareRaw, apy] = await Promise.all([
          multicall.wrap(erc20Contract).symbol(),
          multicall.wrap(erc20Contract).decimals(),
          multicall.wrap(erc20Contract).totalSupply(),
          resolveUnderlyingToken({ multicall, contract: vaultContract }),
          resolvePricePerShare({ multicall, contract: vaultContract }),
          resolveApy ? resolveApy({ multicall, contract: vaultContract, vaultAddress }) : Promise.resolve(0),
        ]);

        // Find underlying token in dependencies
        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
        const underlyingToken = allTokens.find(p => p.address === underlyingTokenAddress);
        if (!underlyingToken) return null;

        // Data props
        const supply = Number(supplyRaw) / 10 ** decimals;
        const pricePerShare = resolvePricePerShareActual({ pricePerShareRaw, decimals });
        const reserve = pricePerShare * supply;
        const price = underlyingToken.price * pricePerShare;
        const tokens = [underlyingToken];
        const liquidity = price * supply;

        // Display props
        const label = resolvePrimaryLabel({ vaultAddress, symbol, underlyingToken });
        const secondaryLabel = buildDollarDisplayItem(price);
        const tertiaryLabel = resolveApy ? `${(apy * 100).toFixed(3)}% APY` : '';
        const images = getImagesFromToken(underlyingToken);
        const statsItems: StatsItem[] = [];
        if (resolveApy) statsItems.push({ label: 'APY', value: buildPercentageDisplayItem(apy) });

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
          },

          displayProps: {
            label,
            secondaryLabel,
            tertiaryLabel,
            images,
            statsItems,
          },
        };

        return vaultToken;
      }),
    );

    return compact(curvePoolTokens).filter(v => v.price > 0 && v.supply > 0);
  }
}
