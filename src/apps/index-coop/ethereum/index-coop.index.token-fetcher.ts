import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { AAVE_V2_DEFINITION } from '~apps/aave-v2';
import { COMPOUND_DEFINITION } from '~apps/compound';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { IndexCoopContractFactory } from '../contracts';
import { INDEX_COOP_DEFINITION } from '../index-coop.definition';

const indexTokenAddresses = [
  { address: '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b' }, // DPI
  { address: '0x72e364f2abdc788b7e918bc238b21f109cd634d7' }, // MVI
  { address: '0x33d63ba1e57e54779f7ddaeaa7109349344cf5f1' }, // DATA
  { address: '0x2af1df3ab0ab157e1e2ad8f88a7d04fbea0c7dc6' }, // BED
  { address: '0x47110d43175f7f2c2425e7d15792acc5817eb44f' }, // GMI
  { address: '0x02e7ac540409d32c90bfb51114003a9e1ff0249c' }, // JPG
  { address: '0x7c07f7abe10ce8e33dc6c5ad68fe033085256a84' }, // icETH
  { address: '0xaa6e8127831c9de45ae56bb1b0d4d4da6e5665bd' }, // ETH x2 Flex Leverage
  { address: '0x0b498ff89709d3838a063f1dfa463091f9801c2b' }, // BTC x2 Flex Leverage
];

const appId = INDEX_COOP_DEFINITION.id;
const groupId = INDEX_COOP_DEFINITION.groups.index.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumIndexCoopIndexTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(IndexCoopContractFactory) private readonly indexCoopContractFactory: IndexCoopContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(
      {
        appId: AAVE_V2_DEFINITION.id,
        groupIds: [AAVE_V2_DEFINITION.groups.supply.id],
        network,
      },
      {
        appId: COMPOUND_DEFINITION.id,
        groupIds: [COMPOUND_DEFINITION.groups.supply.id],
        network,
      },
    );
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const allTokens = [...baseTokens, ...appTokens];

    const indexTokens = await Promise.all(
      indexTokenAddresses.map(async token => {
        const indexContract = this.indexCoopContractFactory.indexToken({ network, address: token.address });

        const [label, symbol, decimals, supplyRaw, underlyingTokenAddresses] = await Promise.all([
          multicall.wrap(indexContract).name(),
          multicall.wrap(indexContract).symbol(),
          multicall.wrap(indexContract).decimals(),
          multicall.wrap(indexContract).totalSupply(),
          multicall.wrap(indexContract).getComponents(),
        ]);

        const tokensWithLiquidityRaw = await Promise.all(
          underlyingTokenAddresses.map(async underlyingAddressRaw => {
            const underlyingAddress = underlyingAddressRaw.toLowerCase();

            const underlyingToken = allTokens.find(v => v.address === underlyingAddress);
            if (!underlyingToken) return null;

            const balanceOfRaw = await multicall.wrap(indexContract).getTotalComponentRealUnits(underlyingAddress);
            const balanceOf = Number(balanceOfRaw) / 10 ** underlyingToken.decimals;

            return {
              liquidity: balanceOf * underlyingToken.price,
              baseToken: underlyingToken,
            };
          }),
        );

        const tokensWithLiquidity = _.compact(tokensWithLiquidityRaw);
        const tokens = tokensWithLiquidity.map(x => x.baseToken);
        const liquidityPerToken = tokensWithLiquidity.map(x => x.liquidity);

        const price = _.sum(liquidityPerToken);
        const supply = Number(supplyRaw) / 10 ** decimals;
        const pricePerShare = 1;
        const liquidity = price * supply;

        const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

        const poolToken: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: token.address,
          network,
          supply,
          decimals,
          symbol,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            liquidity,
            exchangeable: true,
          },

          displayProps: {
            label,
            secondaryLabel: symbol,
            images: [getTokenImg(token.address, network)],
            statsItems,
          },
        };

        return poolToken;
      }),
    );

    return indexTokens;
  }
}
