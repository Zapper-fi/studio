import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { InverseFirmContractFactory } from '../contracts';
import { INVERSE_FIRM_DEFINITION } from '../inverse-firm.definition';
import _ from 'lodash';
import { ContractType } from '~position/contract.interface';
import { borrowed, supplied } from '~position/position.utils';
import { getMarkets } from '../common/inverse-firm.utils';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';

const appId = INVERSE_FIRM_DEFINITION.id;
const dola = INVERSE_FIRM_DEFINITION.dola;
const dbr = INVERSE_FIRM_DEFINITION.dbr;
const groupId = INVERSE_FIRM_DEFINITION.groups.loan.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumInverseFirmLoanContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(InverseFirmContractFactory) private readonly inverseFirmContractFactory: InverseFirmContractFactory,
  ) { }

  async getMarkets() {
    const dbrContract = this.inverseFirmContractFactory.dbr({ address: dbr, network });
    return getMarkets(dbrContract);
  }

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const dolaToken = baseTokens.find(bt => bt.address === dola.toLowerCase())!;
    const dolaAsBorrowToken = borrowed(dolaToken);

    const markets = await this.getMarkets();

    const multicall = this.appToolkit.getMulticall(network);
    const dolaContract = this.appToolkit.globalContracts.erc20({ address: dola, network });

    const marketsData = await Promise.all(
      markets.map(m => {
        const contract = this.inverseFirmContractFactory.simpleMarket({ address: m, network });
        return Promise.all(
          [
            multicall.wrap(contract).totalDebt(),
            multicall.wrap(contract).collateral(),
            multicall.wrap(dolaContract).balanceOf(m),
          ]
        );
      })
    );

    const positions: ContractPosition[] = marketsData.map((data, i) => {
      const collateralAddress = data[1];
      const dolaBalance = data[2];
      const liquidity = Number(dolaBalance) / 1e18;
      const token = baseTokens.find(bt => bt.address === collateralAddress.toLowerCase())!;
      const suppliedToken = supplied(token);

      const tokens = [
        {
          "type": suppliedToken.type,
          "network": suppliedToken.network,
          "address": suppliedToken.address,
          "symbol": suppliedToken.symbol,
          "decimals": suppliedToken.decimals,
          "price": suppliedToken.price,
          metaType: MetaType.SUPPLIED,
        },
        {
          "type": dolaAsBorrowToken.type,
          "network": dolaAsBorrowToken.network,
          "address": dolaAsBorrowToken.address,
          "symbol": dolaAsBorrowToken.symbol,
          "decimals": dolaAsBorrowToken.decimals,
          "price": dolaAsBorrowToken.price,
          metaType: MetaType.BORROWED,
        },
      ];

      return {
        type: ContractType.POSITION,
        address: markets[i],
        appId,
        groupId,
        network,
        tokens,
        dataProps: {
          liquidity,
        },
        displayProps: {
          label: `${suppliedToken.symbol} Market`,
          secondaryLabel: {
            type: 'dollar',
            value: suppliedToken.price,
          },
          images: getImagesFromToken(suppliedToken),
        },
        statsItems: [
          {
            "label": "Total Liquidity",
            "value": {
              "type": "dollar",
              "value": liquidity,
            }
          },
        ],
      }
    })

    return _.compact(positions);
  }
}
