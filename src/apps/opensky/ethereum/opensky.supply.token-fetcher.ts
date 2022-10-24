import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken, getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OpenskyContractFactory } from '../contracts';
import { OPENSKY_DEFINITION } from '../opensky.definition';

const appId = OPENSKY_DEFINITION.id;
const groupId = OPENSKY_DEFINITION.groups.supply.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumOpenskySupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  graphReservesQuery = gql`
    query GET_RESERVES {
      reserves {
        id
        name
        symbol
        underlyingAsset
        oTokenAddress
        totalDeposits
        totalAmountOfBespokeLoans
        totalAmountOfInstantLoans
      }
    }
  `;

  graphUrl = 'https://api.studio.thegraph.com/query/30874/openskyfinancefallback/v0.0.2';

  OpenSkyDataProviderAddress = '0xa5c8b4cbc10ae6ca5c11264f03d0a1d406b9c05b';

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OpenskyContractFactory) private readonly openskyContractFactory: OpenskyContractFactory,
  ) {}

  async getReserves() {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;

    const data: any = await graphHelper.requestGraph<any>({
      endpoint: this.graphUrl,
      query: this.graphReservesQuery,
    });
    const reserves = data.reserves;

    const multicall = this.appToolkit.getMulticall(network);
    const OpenSkyDataProvider = this.openskyContractFactory.openSkyDataProvider({
      address: this.OpenSkyDataProviderAddress,
      network,
    });

    const reservesDataFromABI = await Promise.all(
      reserves.map(item => {
        return multicall.wrap(OpenSkyDataProvider).getReserveData(item.id);
      }),
    );

    const moneyMarketSupplyRates = await Promise.all(
      reserves.map(item => {
        return multicall.wrap(OpenSkyDataProvider).getMoneyMarketSupplyRateInstant(item.id);
      }),
    );
    const reserves2 = reserves.map((item, index) => {
      const abiItem = reservesDataFromABI[index];
      const { borrowRate, totalBorrowsBalance, TVL, availableLiquidity } = abiItem;
      const supplyRate = totalBorrowsBalance
        .mul(borrowRate)
        .div(TVL)
        .add(availableLiquidity.mul(moneyMarketSupplyRates[index]).div(TVL));

      const instantLoan = item.totalAmountOfInstantLoans;
      const bespokeLoan = item.totalAmountOfBespokeLoans;

      const totalDeposits = BigNumber.from(instantLoan).add(bespokeLoan).add(availableLiquidity);
      const totalBorrows = BigNumber.from(instantLoan).add(bespokeLoan);

      return {
        ...item,
        supplyRate,
        totalDeposits,
        totalBorrows,
      };
    });
    return reserves2;
  }
  async getPositions() {
    const reserves = await this.getReserves();

    const multicall = this.appToolkit.getMulticall(network);

    const tokens = await Promise.all(
      reserves.map(async item => {
        const contract = this.openskyContractFactory.openSkyOToken({
          address: item.oTokenAddress,
          network,
        });

        const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);

        const allTokenDependencies = [...baseTokenDependencies];

        const underlyingToken = allTokenDependencies.find(v => v.address === item.underlyingAsset);

        if (!underlyingToken) return null;

        // Request the symbol, decimals, ands supply for the token
        const [symbol, decimals] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
        ]);

        // Denormalize the supply
        const supply = Number(item.totalDeposits) / 10 ** decimals;
        const price = underlyingToken.price;

        //displayProps
        const label = `${getLabelFromToken(underlyingToken)}`;
        // For images, we'll use the underlying token images as well
        const images = getTokenImg(underlyingToken.address);
        const secondaryLabel = buildDollarDisplayItem(price);
        const tertiaryLabel = `${((Number(item.supplyRate) / 10 ** 27) * 100).toFixed(3)}% APY`;

        // Create the token object
        const tokenInfo: any = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare: 1,
          address: item.oTokenAddress.toLowerCase(),
          tokens: [underlyingToken],
          dataProps: {
            apy: (Number(item.supplyRate) / 10 ** 27) * 100,
            liquidity: supply * price,
          },
          displayProps: {
            label,
            images,
            secondaryLabel,
            tertiaryLabel,
          },
        };
        return tokenInfo;
      }),
    );
    return compact(tokens);
  }
}
