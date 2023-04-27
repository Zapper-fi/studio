import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { parseBytes32String } from 'ethers/lib/utils';
import { gql } from 'graphql-request';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance, RawContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams } from '~position/template/contract-position.template.types';

import { SynthetixContractFactory, SynthetixPerp } from '../contracts';

export type Market = {
  id: string;
  marketKey: string;
  asset: string;
};

export type FuturesMarkets = {
  futuresMarkets: Market[];
};

export const FUTURES_MARKETS_QUERY = gql`
  query MyQuery {
    futuresMarkets {
      id
      marketKey
      asset
    }
  }
`;

export type SynthetixPerpPositionDefinition = {
  address: string;
  side: string;
  asset: string;
};

export abstract class OptimismSynthetixPerpContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SynthetixPerp,
  DefaultDataProps,
  SynthetixPerpPositionDefinition
> {
  useCustomMarketLogos = false;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SynthetixPerp {
    return this.contractFactory.synthetixPerp({ address, network: this.network });
  }

  abstract marketFilter(marketKey: string): boolean;

  protected isV2Market(marketKey: string): boolean {
    const marketKeyString = parseBytes32String(marketKey);
    //v2 marketKey includes 'PERP', v1 doesn't
    return marketKeyString.includes('PERP');
  }

  async getDefinitions(): Promise<SynthetixPerpPositionDefinition[]> {
    const { futuresMarkets } = await gqlFetch<FuturesMarkets>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/kwenta/optimism-perps',
      query: FUTURES_MARKETS_QUERY,
    });

    const markets = futuresMarkets.filter(market => this.marketFilter(market.marketKey));

    const definitions = ['SHORT', 'NEUTRAL', 'LONG']
      .map(optionType =>
        markets.map(market => {
          const baseAssetRaw = parseBytes32String(market.asset);
          const baseAsset = baseAssetRaw.charAt(0) === 's' ? baseAssetRaw.substring(1) : baseAssetRaw;
          return { address: market.id.toLowerCase(), side: optionType, asset: baseAsset };
        }),
      )
      .flat();

    return definitions;
  }

  async getTokenDefinitions() {
    return [
      {
        address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9', // sUSD
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<SynthetixPerp, DefaultDataProps, SynthetixPerpPositionDefinition>): Promise<string> {
    return `${definition.asset}-PERP ${definition.side}`;
  }

  async getDataProps({ definition }) {
    return { side: definition.side };
  }

  async getImages({
    definition,
  }: GetDisplayPropsParams<SynthetixPerp, DefaultDataProps, SynthetixPerpPositionDefinition>) {
    return [getAppAssetImage(this.useCustomMarketLogos ? this.appId : 'synthetix', `s${definition.asset}`)];
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    if (!contractPositions) return [];

    const allPositions = await Promise.all(
      contractPositions.map(async contractPosition => {
        const synthPerpContract = this.contractFactory.synthetixPerp({
          address: contractPosition.address,
          network: this.network,
        });
        const remainingMargin = await multicall.wrap(synthPerpContract).remainingMargin(address);
        const marginRemaining = remainingMargin.marginRemaining;
        if (Number(marginRemaining) === 0) return [];

        const position = await multicall.wrap(synthPerpContract).positions(address);
        const side = contractPosition.dataProps.side;
        const size = Number(position.size);

        const matchesSide =
          (size > 0 && side === 'LONG') || (size < 0 && side === 'SHORT') || (size === 0 && side === 'NEUTRAL');
        if (!matchesSide) return [];

        const tokens = [drillBalance(contractPosition.tokens[0], marginRemaining.toString())];
        const balanceUSD = sumBy(tokens, v => v.balanceUSD);

        const contractPositionBalance: ContractPositionBalance = {
          ...contractPosition,
          tokens,
          balanceUSD,
        };

        return contractPositionBalance;
      }),
    );

    return allPositions.flat();
  }

  async getRawBalances(address: string): Promise<RawContractPositionBalance[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    if (!contractPositions) return [];

    return (
      await Promise.all(
        contractPositions
          .map(async contractPosition => {
            const synthPerpContract = this.contractFactory.synthetixPerp({
              address: contractPosition.address,
              network: this.network,
            });
            const remainingMargin = await multicall.wrap(synthPerpContract).remainingMargin(address);
            const marginRemaining = remainingMargin.marginRemaining;
            if (Number(marginRemaining) === 0) return [];

            const position = await multicall.wrap(synthPerpContract).positions(address);
            const side = contractPosition.dataProps.side;
            const size = Number(position.size);

            const matchesSide =
              (size > 0 && side === 'LONG') || (size < 0 && side === 'SHORT') || (size === 0 && side === 'NEUTRAL');
            if (!matchesSide) return [];

            return [
              {
                key: this.appToolkit.getPositionKey(contractPosition),
                tokens: [
                  {
                    key: this.appToolkit.getPositionKey(contractPosition.tokens[0]),
                    balance: marginRemaining.toString(),
                  },
                ],
              },
            ];
          })
          .flat(),
      )
    ).flat();
  }
}
