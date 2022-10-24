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
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OpenskyContractFactory } from '../contracts';
import { OPENSKY_DEFINITION } from '../opensky.definition';

const appId = OPENSKY_DEFINITION.id;
const groupId = OPENSKY_DEFINITION.groups.borrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumOpenskyBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
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
  OpenSkyPoolAddress = '0xdae29a91f663faf7657594f908e183e3b826d437';

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
        borrowRate,
        totalBorrowsBalance,
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

        // one-to-one
        const tokens = [underlyingToken];

        // Request decimals for openSkyOToken and underlyingToken, which is always the same
        const [decimals] = await Promise.all([multicall.wrap(contract).decimals()]);

        // for dataProps
        const borrow = Number(item.totalBorrows) / 10 ** decimals;

        //for displayProps
        const label = `${getLabelFromToken(underlyingToken)}`;
        // For images, we'll use the underlying token images as well
        const images = getTokenImg(underlyingToken.address);
        const secondaryLabel = buildDollarDisplayItem(underlyingToken.price);
        const tertiaryLabel = `${((Number(item.borrowRate) / 10 ** 27) * 100).toFixed(3)}% APY`;

        // Create the position object
        const position: any = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address: this.OpenSkyPoolAddress,
          network,
          tokens,
          dataProps: {
            apy: (Number(item.borrowRate) / 10 ** 27) * 100,
            liquidity: borrow * underlyingToken.price,
          },
          displayProps: {
            label,
            images,
            secondaryLabel,
            tertiaryLabel,
          },
        };

        return position;
      }),
    );
    return compact(tokens);
  }
}
