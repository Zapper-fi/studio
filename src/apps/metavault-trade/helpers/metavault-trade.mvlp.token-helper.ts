import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MetavaultTradeContractFactory } from '../contracts';
import { METAVAULT_TRADE_DEFINITION } from '../metavault-trade.definition';

type GetMetavaultTradeMvlpTokenParams = {
  network: Network;
  mvlpManagerAddress: string;
  mvlpTokenAddress: string;
  blockedTokenAddresses: string[];
};

@Injectable()
export class MetavaultTradeMvlpTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MetavaultTradeContractFactory) private readonly contractFactory: MetavaultTradeContractFactory,
  ) {}

  async getTokens({
    network,
    mvlpManagerAddress,
    mvlpTokenAddress,
    blockedTokenAddresses,
  }: GetMetavaultTradeMvlpTokenParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const mvlpManagerContract = this.contractFactory.mvlpManager({ address: mvlpManagerAddress, network });
    const mvlpTokenContract = this.contractFactory.erc20({ address: mvlpTokenAddress, network });
    const [symbol, decimals, supplyRaw, vaultAddressRaw] = await Promise.all([
      multicall.wrap(mvlpTokenContract).symbol(),
      multicall.wrap(mvlpTokenContract).decimals(),
      multicall.wrap(mvlpTokenContract).totalSupply(),
      multicall.wrap(mvlpManagerContract).vault(),
    ]);

    // Tokens
    const vaultAddress = vaultAddressRaw.toLowerCase();
    const vaultContract = this.contractFactory.vault({ address: vaultAddress, network });
    const mcVault = multicall.wrap(vaultContract);
    const numTokens = await mcVault.allWhitelistedTokensLength();
    const tokenAddressesRaw = await Promise.all(range(0, Number(numTokens)).map(i => mcVault.allWhitelistedTokens(i)));
    const tokensRaw = tokenAddressesRaw.map(t1 => baseTokens.find(t2 => t2.address === t1.toLowerCase()));
    const tokensUnfiltered = _.compact(tokensRaw);
    const tokens = tokensUnfiltered.filter(x => !blockedTokenAddresses.includes(x.address));

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
    const images = [getTokenImg(mvlpTokenAddress, network)];
    const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

    const mvlpToken: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: mvlpTokenAddress,
      appId: METAVAULT_TRADE_DEFINITION.id,
      groupId: METAVAULT_TRADE_DEFINITION.groups.mvlp.id,
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

    return [mvlpToken];
  }
}
