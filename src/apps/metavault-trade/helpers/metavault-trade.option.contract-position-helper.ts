import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { MetavaultTradeContractFactory } from '../contracts';
import METAVAULT_TRADE_DEFINITION from '../metavault-trade.definition';

export type MetavaultTradeOptionContractPositionDataProps = {
  collateralTokenAddress: string;
  indexTokenAddress: string;
  isLong: boolean;
};

type GetOptionContractPositionHelperParams = {
  network: Network;
  vaultAddress: string;
};

const appId = METAVAULT_TRADE_DEFINITION.id;
const groupId = METAVAULT_TRADE_DEFINITION.groups.option.id;

@Injectable()
export class MetavaultTradeOptionContractPositionHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MetavaultTradeContractFactory) private readonly contractFactory: MetavaultTradeContractFactory,
  ) {}

  async getPosition({ network, vaultAddress }: GetOptionContractPositionHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const vaultContract = this.contractFactory.vault({ address: vaultAddress, network });
    const whitelistedTokenLengthRaw = await multicall.wrap(vaultContract).allWhitelistedTokensLength();

    const whitelistedTokens = await Promise.all(
      _.range(0, Number(whitelistedTokenLengthRaw)).map(async tokenIndex => {
        return (await multicall.wrap(vaultContract).allWhitelistedTokens(tokenIndex)).toLowerCase();
      }),
    );

    const positions = await Promise.all(
      whitelistedTokens.map(async collateralTokenAddress => {
        const positionsForGivenPair = await Promise.all(
          whitelistedTokens.map(indexTokenAddress => {
            const collateralToken = baseTokens.find(x => x.address === collateralTokenAddress);
            const indexToken = baseTokens.find(x => x.address === indexTokenAddress);
            if (!collateralToken || !indexToken) return null;

            const shortPosition: ContractPosition<MetavaultTradeOptionContractPositionDataProps> = {
              type: ContractType.POSITION,
              appId,
              groupId,
              address: vaultAddress,
              key: `${collateralToken.symbol}:${indexToken.symbol}:short`,
              network,
              tokens: [supplied(collateralToken), indexToken],
              dataProps: {
                collateralTokenAddress: collateralToken.address,
                indexTokenAddress: indexToken.address,
                isLong: false,
              },
              displayProps: {
                label: `Short ${indexToken.symbol}`,
                images: [getTokenImg(collateralToken.address, network), getTokenImg(indexToken.address, network)],
                statsItems: [],
              },
            };
            const longPosition: ContractPosition<MetavaultTradeOptionContractPositionDataProps> = {
              type: ContractType.POSITION,
              appId,
              groupId,
              address: vaultAddress,
              key: `${collateralToken.symbol}:${indexToken.symbol}:long`,
              network,
              tokens: [supplied(collateralToken), indexToken],
              dataProps: {
                collateralTokenAddress: collateralToken.address,
                indexTokenAddress: indexToken.address,
                isLong: true,
              },
              displayProps: {
                label: `Long ${indexToken.symbol}`,
                images: [getTokenImg(collateralToken.address, network), getTokenImg(indexToken.address, network)],
                statsItems: [],
              },
            };

            return [shortPosition, longPosition];
          }),
        );

        return _.compact(positionsForGivenPair).flat();
      }),
    );

    return positions.flat();
  }
}
