import { Inject } from '@nestjs/common';
import { compact, groupBy, sumBy, values } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { getPositions } from '../helpers/graph';
import { MEAN_FINANCE_DEFINITION } from '../mean-finance.definition';

const appId = MEAN_FINANCE_DEFINITION.id;
const groupId = MEAN_FINANCE_DEFINITION.groups.dcaPosition.id;
const network = Network.OPTIMISM_MAINNET;

type MeanFinanceDcaPositionContractPositionDataProps = {
  id: string;
  liquidity: number;
  from: string;
  to: string;
};

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismMeanFinanceDcaPositionContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const dcaHubAddress = '0x059d306a25c4ce8d7437d25743a8b94520536bd5';
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const positionsData = await getPositions(network, graphHelper);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const positions = positionsData.positions;

    const maybePositions = positions.map(dcaPosition => {
      const from = baseTokens.find(v => v.address === dcaPosition.from.address.toLowerCase());
      const to = baseTokens.find(v => v.address === dcaPosition.to.address.toLowerCase());
      if (!from || !to) return null;

      const tokens = [supplied(from), claimable(to)];
      const liquidityToSwapRaw = dcaPosition.current.remainingLiquidity;
      const liquidityToWithdrawRaw = dcaPosition.current.idleSwapped;
      const liquidityToSwap = (Number(liquidityToSwapRaw) / 10 ** from.decimals) * from.price;
      const liquidityToWithdraw = (Number(liquidityToWithdrawRaw) / 10 ** to.decimals) * to.price;
      const liquidity = liquidityToSwap + liquidityToWithdraw;

      const label = `${getLabelFromToken(from)} to ${getLabelFromToken(to)}`;
      const images = [...getImagesFromToken(from), ...getImagesFromToken(to)];

      const position: ContractPosition<MeanFinanceDcaPositionContractPositionDataProps> = {
        type: ContractType.POSITION,
        address: dcaHubAddress,
        appId: MEAN_FINANCE_DEFINITION.id,
        groupId: MEAN_FINANCE_DEFINITION.groups.dcaPosition.id,
        network,
        tokens,
        dataProps: {
          from: from.address,
          to: to.address,
          id: dcaPosition.id,
          liquidity,
        },
        displayProps: {
          label,
          images,
        },
      };

      return position;
    });

    const allPositions = compact(maybePositions);
    const groupedPositionsRecord = groupBy(allPositions, v => `${v.dataProps.from}:${v.dataProps.to}`);
    const groupedPositions = values(groupedPositionsRecord);

    const mergedPositions = groupedPositions.map(positionsForDirectionalPair => {
      const totalLiquidity = sumBy(positionsForDirectionalPair, v => v.dataProps.liquidity);
      const mergedPosition = positionsForDirectionalPair[0];
      mergedPosition.dataProps.liquidity = totalLiquidity;
      mergedPosition.displayProps.secondaryLabel = `${positionsForDirectionalPair.length} active positions`;
      return mergedPosition;
    });

    return mergedPositions;
  }
}
