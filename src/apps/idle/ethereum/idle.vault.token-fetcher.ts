import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { IdleContractFactory } from '../contracts';
import { IDLE_DEFINITION } from '../idle.definition';

const appId = IDLE_DEFINITION.id;
const groupId = IDLE_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumIdleVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(IdleContractFactory) private readonly idleContractFactory: IdleContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const controller = this.idleContractFactory.idleController({
      address: '0x275da8e61ea8e02d51edd8d0dc5c0e62b4cdb0be',
      network,
    });
    const marketTokenAddresses = await multicall.wrap(controller).getAllMarkets();

    const vaultTokens = await Promise.all(
      marketTokenAddresses.map(async tokenAddressRaw => {
        const tokenAddress = tokenAddressRaw.toLowerCase();
        const tokenContract = this.idleContractFactory.idleToken({ network, address: tokenAddress });

        const [label, symbol, underlyingTokenAddressRaw, decimalsRaw, priceRaw, apyRaw, supplyRaw] = await Promise.all([
          multicall.wrap(tokenContract).name(),
          multicall.wrap(tokenContract).symbol(),
          multicall.wrap(tokenContract).token(),
          multicall.wrap(tokenContract).decimals(),
          multicall.wrap(tokenContract).tokenPrice(),
          multicall.wrap(tokenContract).getAvgAPR(),
          multicall.wrap(tokenContract).totalSupply(),
        ]);

        const underlyingToken = baseTokens.find(price => price.address === underlyingTokenAddressRaw.toLowerCase());
        if (!underlyingToken) return null;

        const decimals = Number(decimalsRaw);
        const price = Number(priceRaw) / 10 ** underlyingToken.decimals;
        const pricePerShare = price / underlyingToken.price;
        const apy = Number(apyRaw) / 10 ** 18 / 100;
        const supply = Number(supplyRaw) / 10 ** decimals;
        const liquidity = supply * price;
        const tokens = [underlyingToken];

        const appToken: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          network,
          appId,
          groupId,
          address: tokenAddress,
          decimals,
          symbol,
          displayProps: {
            label,
            statsItems: [
              { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
              { label: 'APY', value: buildPercentageDisplayItem(apy) },
            ],
            images: [getAppImg(appId)],
          },
          dataProps: {
            liquidity,
            apy,
          },
          price,
          pricePerShare,
          supply,
          tokens,
        };

        return appToken;
      }),
    );

    return _.compact(vaultTokens);
  }
}
