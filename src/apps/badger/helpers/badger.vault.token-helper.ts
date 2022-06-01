import { Inject, Injectable } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { BADGER_DEFINITION } from '../badger.definition';
import { BadgerContractFactory } from '../contracts';

type BadgerTokenDefinition = {
  address: string;
  underlyingAddress: string;
};

type BadgerGetVaultTokensParams = {
  network: Network;
  definitions: BadgerTokenDefinition[];
  dependencies: AppGroupsDefinition[];
};

@Injectable()
export class BadgerVaultTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BadgerContractFactory) private readonly contractFactory: BadgerContractFactory,
  ) {}

  async getTokens({ network, definitions, dependencies }: BadgerGetVaultTokensParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);

    const vaultTokens = await Promise.all(
      definitions.map(async ({ address, underlyingAddress }) => {
        const settContract = this.contractFactory.badgerSett({ address: address, network });
        const yVaultContract = this.contractFactory.badgerYearnVault({ address: address, network });

        // Get underlying token
        const underlyingToken = [...appTokens, ...baseTokens].find(pool => pool.address === underlyingAddress);
        if (!underlyingToken) return null;

        // Get ratio, supply, and decimals
        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(settContract).symbol(),
          multicall.wrap(settContract).decimals(),
          multicall.wrap(settContract).totalSupply(),
        ]);

        // In the case of the byvBTC sett, use the yVault contract to get the ratio
        const ratioRaw =
          address === '0x4b92d19c11435614cd49af1b589001b7c08cd4d5'
            ? await multicall.wrap(yVaultContract).pricePerShare()
            : await multicall.wrap(settContract).getPricePerFullShare();

        // Data Props
        const pricePerShare = Number(ratioRaw) / 10 ** decimals;
        const supply = Number(supplyRaw) / 10 ** decimals;
        const reserve = pricePerShare * supply;
        const underlyingPrice = underlyingToken.price;
        const liquidity = reserve * underlyingPrice;
        const tokens = [underlyingToken];

        // Token Price
        let price = liquidity / supply;
        if (address === '0x7e7e112a68d8d2e221e11047a72ffc1065c38e1a') {
          // bDIGG is a rebalancing token, calculate its price based on the underlying balance of DIGG
          const contractDiggBalanceRaw = await multicall.wrap(settContract).balance();
          const contractDiggBalance = Number(contractDiggBalanceRaw) / 10 ** underlyingToken.decimals;
          price = (contractDiggBalance / supply) * underlyingPrice;
        }

        // Display Props
        const label = `${getLabelFromToken(underlyingToken)} Sett Vault`;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = getImagesFromToken(underlyingToken);

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId: BADGER_DEFINITION.id,
          groupId: BADGER_DEFINITION.groups.vault.id,
          address,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            liquidity,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
          },
        };

        return token;
      }),
    );

    return compact(vaultTokens);
  }
}
