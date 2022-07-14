import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ATLENDIS_V_1_DEFINITION } from '../atlendis-v1.definition';
import { AtlendisV1ContractFactory } from '../contracts';
import { GET_USER_POSITIONS } from '../graphql/getPositions';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(ATLENDIS_V_1_DEFINITION.id, network)
export class PolygonAtlendisV1BalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    private readonly atlendisContractFactory: AtlendisV1ContractFactory,
  ) {}

  async getPositionBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await graphHelper.requestGraph({
      endpoint: 'https://atlendis.herokuapp.com/graphql',
      query: GET_USER_POSITIONS,
      variables: { address },
    });
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const positions = await Promise.all(
      data.positions.map(async position => {
        const underlyingToken = baseTokens.find(
          t => t.address.toLowerCase() === position.pool.parameters.token.address.toLowerCase(),
        );
        if (!underlyingToken) return null;
        const positionManagerAddress = '0x55E4e70a725C1439dac6B9412B71fC8372Bd73e9';

        const positionContract: ContractPosition = {
          type: ContractType.POSITION,
          appId: ATLENDIS_V_1_DEFINITION.id,
          groupId: ATLENDIS_V_1_DEFINITION.groups.position.id,
          address: positionManagerAddress,
          network,
          tokens: [supplied(underlyingToken)],
          dataProps: {
            tokenId: position.tokenId,
          },
          displayProps: {
            label: getLabelFromToken(underlyingToken),
            images: getImagesFromToken(underlyingToken),
          },
        };

        const contract = this.atlendisContractFactory.positionManager({
          address: positionManagerAddress,
          network,
        });

        const { bondsQuantity, normalizedDepositedAmount } = await contract.getPositionRepartition(position.tokenId);

        const tokenBalances = [
          drillBalance(
            positionContract.tokens[0],
            BigNumber.from(bondsQuantity).add(BigNumber.from(normalizedDepositedAmount)).toString(),
          ),
        ];
        const contractPositionBalance: ContractPositionBalance = {
          ...positionContract,
          tokens: tokenBalances,
          balanceUSD: sumBy(tokenBalances, v => v.balanceUSD),
        };
        return contractPositionBalance;
      }),
    );
    return positions;
  }

  async getBalances(address: string) {
    const assets = await this.getPositionBalances(address);
    return presentBalanceFetcherResponse([
      {
        label: 'Positions',
        assets,
      },
    ]);
  }
}
