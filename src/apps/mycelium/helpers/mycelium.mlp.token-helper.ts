import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MyceliumContractFactory } from '../contracts';
import { MYCELIUM_DEFINITION } from '../mycelium.definition';

import { MLP_MANAGER_ADDRESS, MLP_TOKEN_ADDRESS } from './mycelium.constants';

type MyceliumMlpTokenParams = {
  network: Network;
  blockedTokenAddresses: string[];
};

@Injectable()
export class MyceliumMlpTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MyceliumContractFactory) private readonly contractFactory: MyceliumContractFactory,
  ) {}

  async getTokens({ network, blockedTokenAddresses }: MyceliumMlpTokenParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const mlpManagerContract = this.contractFactory.myceliumAumManager({ address: MLP_MANAGER_ADDRESS, network });
    const mlpTokenContract = this.contractFactory.erc20({ address: MLP_TOKEN_ADDRESS, network });
    const [symbol, decimals, supplyRaw, vaultAddressRaw] = await Promise.all([
      multicall.wrap(mlpTokenContract).symbol(),
      multicall.wrap(mlpTokenContract).decimals(),
      multicall.wrap(mlpTokenContract).totalSupply(),
      multicall.wrap(mlpManagerContract).vault(),
    ]);

    // Tokens
    const vaultAddress = vaultAddressRaw.toLowerCase();
    const vaultContract = this.contractFactory.myceliumVault({ address: vaultAddress, network });
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
    const images = [getTokenImg(MLP_TOKEN_ADDRESS, network)];
    const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

    const mlpToken: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: MLP_TOKEN_ADDRESS,
      appId: MYCELIUM_DEFINITION.id,
      groupId: MYCELIUM_DEFINITION.groups.mlp.id,
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

    return [mlpToken];
  }
}
