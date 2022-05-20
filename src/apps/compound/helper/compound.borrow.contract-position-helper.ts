import { Inject, Injectable } from '@nestjs/common';
import { isNumber } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { borrowed } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { CompoundContractFactory } from '../contracts';

export type CompoundSupplyTokenDataProps = {
  supplyApy: number;
  borrowApy: number;
  liquidity: number;
  supply: number;
};

type CompoundBorrowContractPositionHelperParams = {
  network: Network;
  appId: string;
  groupId: string;
  supplyGroupId: string;
};

@Injectable()
export class CompoundBorrowContractPositionHelper {
  constructor(
    @Inject(CompoundContractFactory) private readonly contractFactory: CompoundContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions({ network, appId, groupId, supplyGroupId }: CompoundBorrowContractPositionHelperParams) {
    const appTokens = await this.appToolkit.getAppTokenPositions<CompoundSupplyTokenDataProps>({
      appId,
      groupIds: [supplyGroupId],
      network,
    });

    const multicall = this.appToolkit.getMulticall(network);
    const promisedPositions = appTokens.map(async appToken => {
      const contract = this.contractFactory.compoundCToken({ network, address: appToken.address });

      // Compound has a `getCash` method which returns the total liquidity
      // of a given borrowed contract position. This is typically what defilama
      // would use to display a TVL
      const [cash] = await Promise.all([multicall.wrap(contract).getCash()]);
      // The "cash" needs to be converted back into a proper number format.
      // We use the underlying token as the basis for the conversion.
      const cashSupply = this.appToolkit
        .getBigNumber(cash)
        .div(10 ** appToken.tokens[0].decimals)
        .toNumber();

      const tokens = [borrowed(appToken.tokens[0])];
      // The underlying token liquidity actually represents the TOTAL SUPPLY of a borrowed
      // contract position, not the liquidity.
      const underlyingLiquidity = appToken.dataProps.liquidity;
      const underlyingPrice = appToken.tokens[0].price;
      // Liquidity is the total supply of "cash" multiplied by the price of an underlying token
      const borrowedPositionliquidity = cashSupply * underlyingPrice;

      const dataProps = {
        ...appToken.dataProps,
        liquidity: borrowedPositionliquidity,
        supply: underlyingLiquidity,
        // The amount borrowed can be derived simply by substracting the liquidity from the total supply
        // of tokens
        borrow: underlyingLiquidity - borrowedPositionliquidity,
      };
      const borrowApy = appToken.dataProps.borrowApy;

      // Display Props
      const label = `Borrowed ${getLabelFromToken(appToken.tokens[0])}`;
      const secondaryLabel = buildDollarDisplayItem(underlyingPrice);
      const tertiaryLabel = isNumber(borrowApy) ? `${(borrowApy * 100).toFixed(3)}% APR` : '';
      const images = appToken.displayProps.images;
      const statsItems = isNumber(borrowApy)
        ? [{ label: 'Borrow APR', value: buildPercentageDisplayItem(borrowApy) }]
        : [];

      const contractPosition: ContractPosition<CompoundSupplyTokenDataProps> = {
        type: ContractType.POSITION,
        address: appToken.address,
        network,
        appId,
        groupId,
        tokens,
        dataProps,
        displayProps: {
          label,
          secondaryLabel,
          tertiaryLabel,
          images,
          statsItems,
        },
      };

      return contractPosition;
    });

    const positions = await Promise.all(promisedPositions);

    return positions;
  }
}
