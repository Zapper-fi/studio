import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildStringDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { drillBalance } from '~app-toolkit';
import { sumBy } from 'lodash';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';

import { KwentaContractFactory, KwentaFutures } from '../contracts';
import KWENTA_DEFINITION from '../kwenta.definition';

type GetContracts = {
  futuresMarkets: {
    id: string;
  }[];
};

const getContractsQuery = gql`
  query MyQuery {
    futuresMarkets {
      id
    }
  }
`;

const marketName = new Map<string, string>([
  ['0x001b7876f567f0b3a639332ed1e363839c6d85e2', 'AAVE'],
  ['0x10305c1854d6db8a1060df60bdf8a8b2981249cf', 'DYDX'],
  ['0x1228c7d8bbc5bc53db181bd7b1fce765aa83bf8a', 'LINK'],
  ['0x3ed04ceff4c91872f19b1da35740c0be9ca21558', 'XMR'],
  ['0x4434f56ddbde28fab08c4ae71970a06b300f8881', 'XAU'],
  ['0x4ff54624d5fb61c34c634c3314ed3bfe4dbb665a', 'AVAX'],
  ['0x5af0072617f7f2aeb0e314e2fad1de0231ba97cd', 'UNI'],
  ['0x9f1c2f0071bc3b31447aeda9fa3a68d651eb4632', 'OP'],
  ['0x9f231dbe53d460f359b2b8cc47574493caa5b7bf', 'DOGE'],
  ['0xad44873632840144ffc97b2d1de716f6e2cf0366', 'EUR'],
  ['0xb147c69bee211f57290a6cde9d1babfd0dcf3ea3', 'XAG'],
  ['0xbcb2d435045e16b059b2130b28be70b5ca47bfe5', 'MATIC'],
  ['0xcf853f7f8f78b2b801095b66f8ba9c5f04db1640', 'SOL'],
  ['0xd325b17d5c9c3f2b6853a760afcf81945b0184d3', 'DEBT'],
  ['0xee8804d8ad10b0c3ad1bd57ac3737242ad24bb95', 'BTC'],
  ['0xf86048dff23cf130107dfb4e6386f574231a5c65', 'ETH'],
  ['0x4aa0dabd22bc0894975324bec293443c8538bd08', 'BNB'],
  ['0xfe00395ec846240dc693e92ab2dd720f94765aa3', 'APE'],
]);

@Injectable()
export class OptimismKwentaPerpContractPositionFetcher extends ContractPositionTemplatePositionFetcher<KwentaFutures> {
  appId = KWENTA_DEFINITION.id;
  groupId = KWENTA_DEFINITION.groups.perp.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Perp';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KwentaContractFactory) protected readonly contractFactory: KwentaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): KwentaFutures {
    return this.contractFactory.kwentaFutures({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    const contractsFromSubgraph = await this.appToolkit.helpers.theGraphHelper.requestGraph<GetContracts>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/kwenta/optimism-main',
      query: getContractsQuery,
    });
    return contractsFromSubgraph.futuresMarkets.map(futuresMarket => ({ address: futuresMarket.id }));
  }

  async getTokenDefinitions() {
    return [
      { metaType: MetaType.SUPPLIED, address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9' }, // sUSD
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<KwentaFutures>): Promise<string> {
    return `${marketName.get(contractPosition.address)}-PERP`;
  }

  async getDataProps({ contract }: GetDataPropsParams<KwentaFutures>) {
    const currentFundingRateRaw = await contract.currentFundingRate();
    return { label: 'Funding Rate', ...buildNumberDisplayItem(Number(currentFundingRateRaw) / 10 ** 18) };
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<KwentaFutures>) {
    return [getAppAssetImage(this.appId, contractPosition.address)];
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<KwentaFutures>) {
    const remainingMargin = await contract.remainingMargin(address);
    return [remainingMargin.marginRemaining];
  }

  async getBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(this.network);
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const contract = multicall.wrap(this.getContract(contractPosition.address));
        const balancesRaw = await this.getTokenBalancesPerPosition({ address, contract, contractPosition, multicall });
        const allTokens = contractPosition.tokens.map((cp, idx) =>
          drillBalance(cp, balancesRaw[idx]?.toString() ?? '0', { isDebt: cp.metaType === MetaType.BORROWED }),
        );

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);
        const enrichedDisplayItems = await this.getEnrichedDisplayItems({ address, contract });
        return { ...contractPosition, tokens, balanceUSD, displayItems: enrichedDisplayItems };
      }),
    );

    return balances;
  }

  private async getEnrichedDisplayItems({ address, contract }): Promise<MetadataItemWithLabel[]> {
    const position = await contract.positions(address);
    const liquidationPriceRaw = await contract.liquidationPrice(address);
    const pnlRaw = await contract.profitLoss(address);
    const notionalValueRaw = await contract.notionalValue(address);
    return [
      { label: 'Side', ...buildStringDisplayItem(Number(position.size) > 0 ? 'LONG' : 'SHORT') },
      { label: 'Size', ...buildNumberDisplayItem(Number(position.size) / 10 ** 18) },
      { label: 'Notional Value', ...buildDollarDisplayItem(Number(notionalValueRaw.value) / 10 ** 18) },
      { label: 'PnL', ...buildDollarDisplayItem(Number(pnlRaw.pnl) / 10 ** 18) },
      { label: 'Last Price', ...buildDollarDisplayItem(Number(position.lastPrice) / 10 ** 18) },
      { label: 'Liquidation Price', ...buildDollarDisplayItem(Number(liquidationPriceRaw.price) / 10 ** 18) },
    ];
  }

}