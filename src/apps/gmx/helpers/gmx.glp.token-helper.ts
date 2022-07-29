import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { GmxContractFactory } from '../contracts';
import { GMX_DEFINITION } from '../gmx.definition';

type GetGmxGlpTokenParams = {
  network: Network;
  glmManagerAddress: string;
  glpTokenAddress: string;
};

@Injectable()
export class GmxGlpTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GmxContractFactory) private readonly contractFactory: GmxContractFactory,
  ) {}

  async getTokens({ network, glmManagerAddress, glpTokenAddress }: GetGmxGlpTokenParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const glpManagerContract = this.contractFactory.gmxAumManager({ address: glmManagerAddress, network });
    const glpTokenContract = this.contractFactory.erc20({ address: glpTokenAddress, network });
    const [symbol, decimals, supplyRaw, vaultAddressRaw] = await Promise.all([
      multicall.wrap(glpTokenContract).symbol(),
      multicall.wrap(glpTokenContract).decimals(),
      multicall.wrap(glpTokenContract).totalSupply(),
      multicall.wrap(glpManagerContract).vault(),
    ]);

    // Tokens
    const vaultAddress = vaultAddressRaw.toLowerCase();
    const vaultContract = this.contractFactory.gmxVault({ address: vaultAddress, network });
    const mcVault = multicall.wrap(vaultContract);
    const numTokens = await mcVault.allWhitelistedTokensLength();
    const tokenAddressesRaw = await Promise.all(range(0, Number(numTokens)).map(i => mcVault.allWhitelistedTokens(i)));
    const tokensRaw = tokenAddressesRaw.map(t1 => baseTokens.find(t2 => t2.address === t1.toLowerCase()));
    const tokens = _.compact(tokensRaw);

    // Reserves
    const reserves = await Promise.all(
      tokens.map(async token => {
        const contract = this.contractFactory.erc20(token);
        const reserveRaw = await multicall.wrap(contract).balanceOf(vaultAddress);
        return Number(reserveRaw) / 10 ** token.decimals;
      }),
    );

    // Liquidity
    const liquidity = tokens.reduce((acc, t, i) => acc + reserves[i] * t.price, 0);
    const supply = Number(supplyRaw) / 10 ** decimals;
    const price = liquidity / supply;
    const pricePerShare = reserves.map(r => r / supply);

    // Display Props
    const label = symbol;
    const secondaryLabel = buildDollarDisplayItem(price);
    const images = [getTokenImg(glpTokenAddress, network)];
    const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

    const glpToken: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: glpTokenAddress,
      appId: GMX_DEFINITION.id,
      groupId: GMX_DEFINITION.groups.glp.id,
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
        statsItems,
      },
    };

    return [glpToken];
  }
}
