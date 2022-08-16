import { Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StargateContractFactory } from '../contracts';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.pool.id;

type StargatePoolTokenHelperParams = {
  factoryAddress: string;
  network: Network;
  useLocalDecimals?: boolean;
};

@Injectable()
export class StargatePoolTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StargateContractFactory) private readonly stargateContractFactory: StargateContractFactory,
  ) {}

  async getPositions({ factoryAddress, network, useLocalDecimals }: StargatePoolTokenHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId,
      groupIds: [STARGATE_DEFINITION.groups.eth.id],
      network,
    });
    const allTokens = [...appTokens, ...baseTokens];

    // Get pool addresses from Stargate factory
    const factoryContract = this.stargateContractFactory.stargateFactory({ address: factoryAddress, network });
    const mFactoryContract = multicall.wrap(factoryContract);
    const numPools = await mFactoryContract.allPoolsLength();
    const poolAddressesRaw = await Promise.all(range(0, Number(numPools)).map(pid => mFactoryContract.allPools(pid)));

    const tokens = await Promise.all(
      poolAddressesRaw.map(async poolTokenAddressRaw => {
        const poolTokenAddress = poolTokenAddressRaw.toLowerCase();
        const tokenContract = this.stargateContractFactory.stargatePool({ address: poolTokenAddress, network });
        const [underlyingTokenAddressRaw] = await Promise.all([multicall.wrap(tokenContract).token()]);

        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
        const underlyingToken = allTokens.find(p => p.address === underlyingTokenAddress);
        if (!underlyingToken) return null;

        const underlyingTokenContract = this.stargateContractFactory.erc20({
          address: underlyingTokenAddress,
          network,
        });

        const [symbol, convertRate, localDecimalsRaw, decimalsRaw, supplyRaw, pricePerShareRaw, reserveRaw] =
          await Promise.all([
            multicall.wrap(tokenContract).symbol(),
            multicall.wrap(tokenContract).convertRate(),
            multicall.wrap(tokenContract).localDecimals(),
            multicall.wrap(tokenContract).decimals(),
            multicall.wrap(tokenContract).totalSupply(),
            multicall
              .wrap(tokenContract)
              .amountLPtoLD(new BigNumber(10 ** underlyingToken.decimals).toFixed(0))
              .catch(() => 0),
            multicall.wrap(underlyingTokenContract).balanceOf(poolTokenAddress),
          ]);

        // Data Props
        const decimals = Number(decimalsRaw);
        const supply = Number(supplyRaw) / 10 ** decimals;
        const pricePerShare = useLocalDecimals
          ? Number(pricePerShareRaw) / Number(convertRate) / 10 ** Number(localDecimalsRaw)
          : Number(pricePerShareRaw) / 10 ** underlyingToken.decimals;
        const price = underlyingToken.price * pricePerShare;
        const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
        const liquidity = reserve * underlyingToken.price;
        const tokens = [underlyingToken];

        // Display Props
        const label = symbol;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = [getTokenImg(underlyingToken.address, network)];
        const statsItems = [
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
          { label: 'Reserves', value: reserve },
        ];

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          address: poolTokenAddress,
          appId,
          groupId,
          network,
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
            images,
            statsItems,
          },
        };

        return token;
      }),
    );

    return compact(tokens);
  }
}
