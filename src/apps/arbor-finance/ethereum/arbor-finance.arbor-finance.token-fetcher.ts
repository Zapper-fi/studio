import { Inject } from '@nestjs/common';
import dayjs from 'dayjs';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ARBOR_FINANCE_DEFINITION } from '../arbor-finance.definition';
import { ArborFinanceContractFactory } from '../contracts';
import { graphQuery, BondHolders } from '../graphql';

const appId = ARBOR_FINANCE_DEFINITION.id;
const groupId = ARBOR_FINANCE_DEFINITION.groups.arborFinance.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumArborFinanceArborFinanceTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ArborFinanceContractFactory) private readonly arborFinanceContractFactory: ArborFinanceContractFactory,
  ) {}

  async getPositions() {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = graphHelper.requestGraph<BondHolders>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/alwaysbegrowing/arbor-v1',
      query: graphQuery(),
    });
    const bonds = (await data).bonds;

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const tokens = await Promise.all(
      bonds.map(async bond => {
        const symbol = bond.symbol;
        const label = bond.name;
        const images = getImagesFromToken(bond.collateralToken.id);

        const m = dayjs.unix(bond.maturityDate);
        const date = dayjs(new Date());
        const yearsUntilMaturity = m.diff(date, 'year', true);
        const supply = bond.maxSupply;
        const decimals = bond.decimals;
        const ytm = 1 / bond.clearingPrice - 1;

        let price = 0;

        const bondPrice = () => {
          if (yearsUntilMaturity > 0) {
            return (price = 1 / (1 + ytm) ** yearsUntilMaturity);
          } else {
            return (price = 1);
          }
        };

        bondPrice();

        const pricePerShare = price;
        const tokens: any[] = [];

        const underlyingToken = baseTokens.find(v => v.address == bond.collateralToken.id);

        tokens.push(underlyingToken);

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: bond.id,
          network,
          symbol,
          decimals,
          supply,
          tokens,
          price,
          pricePerShare,
          // dataProps: undefined,
          displayProps: {
            label,
            images,
          },
        };

        return token;
      }),
    );
    return compact(tokens);
  }
}
