import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { isNumber } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { EthersMulticall } from '~multicall';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { borrowed } from '~position/position.utils';
import { Network } from '~types/network.interface';

export type CompoundSupplyTokenDataProps = {
  supplyApy: number;
  borrowApy: number;
  liquidity: number;
  supply: number;
};

type CompoundBorrowContractPositionHelperParams<T> = {
  network: Network;
  appId: string;
  groupId: string;
  supplyGroupId: string;
  resolveContract: (opts: { address: string; network: Network }) => T;
  resolveCashRaw: (opts: { contract: T; multicall: EthersMulticall }) => Promise<BigNumberish>;
};

@Injectable()
export class CompoundBorrowContractPositionHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions<T>({
    network,
    appId,
    groupId,
    supplyGroupId,
    resolveContract,
    resolveCashRaw,
  }: CompoundBorrowContractPositionHelperParams<T>) {
    const appTokens = await this.appToolkit.getAppTokenPositions<CompoundSupplyTokenDataProps>({
      appId,
      groupIds: [supplyGroupId],
      network,
    });

    const multicall = this.appToolkit.getMulticall(network);
    const positions = await Promise.all(
      appTokens.map(async appToken => {
        const contract = resolveContract({ address: appToken.address, network });
        const [cashRaw] = await Promise.all([resolveCashRaw({ multicall, contract })]);
        const cash = Number(cashRaw) / 10 ** appToken.tokens[0].decimals;

        const tokens = [borrowed(appToken.tokens[0])];
        // The underlying token liquidity actually represents the TOTAL SUPPLY of a borrowed
        // contract position, not the liquidity.
        const underlyingLiquidity = appToken.dataProps.liquidity;
        const underlyingPrice = appToken.tokens[0].price;
        // Liquidity is the total supply of "cash" multiplied by the price of an underlying token
        const borrowedPositionliquidity = cash * underlyingPrice;

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
      }),
    );

    return positions;
  }
}
