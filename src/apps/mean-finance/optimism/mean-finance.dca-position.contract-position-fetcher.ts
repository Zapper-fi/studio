import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { sumBy, keyBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { WithMetaType } from '~position/display.interface';
import { BaseTokenBalance } from '~position/position-balance.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { getPairs, getPositions } from '../helpers/graph';
import { sortTokens } from '../helpers/tokens';
import { MEAN_FINANCE_DEFINITION } from '../mean-finance.definition';

const appId = MEAN_FINANCE_DEFINITION.id;
const groupId = MEAN_FINANCE_DEFINITION.groups.dcaPosition.id;
const network = Network.OPTIMISM_MAINNET;

interface ExtendedContractPosition extends ContractPosition {
  tokenA?: BaseToken;
  tokenB?: BaseToken;
  tokenALiquidity: BigNumber;
  tokenBLiquidity: BigNumber;
  positions: number;
  id: string;
}
@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismMeanFinanceDcaPositionContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) { }

  async getPositions() {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const positionsData = await getPositions(network, graphHelper);
    const pairsData = await getPairs(network, graphHelper);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const pairs = pairsData.pairs;
    const positions = positionsData.positions;
    const dcaHubAddress = '0x059d306a25c4ce8d7437d25743a8b94520536bd5';

    const contractPositionsByKey: Record<string, ExtendedContractPosition> = keyBy(pairs.map(pair => {
      const tokenA = baseTokens.find(v => v.address === pair.tokenA.address);
      const tokenB = baseTokens.find(v => v.address === pair.tokenB.address);

      let images: string[] = [];

      if (tokenA) {
        tokenA.network = network;
        images = [...images, ...getImagesFromToken(tokenA)];
      }
      if (tokenB) {
        tokenB.network = network;
        images = [...images, ...getImagesFromToken(tokenB)];
      }
      const position: ExtendedContractPosition = {
        type: ContractType.POSITION,
        address: dcaHubAddress,
        appId,
        groupId,
        network,
        tokens: [],
        id: pair.id,
        tokenA,
        tokenB,
        tokenALiquidity: BigNumber.from('0'),
        tokenBLiquidity: BigNumber.from('0'),
        positions: 0,
        dataProps: {
          id: pair.id,
        },
        displayProps: {
          label: `${pair.tokenA.symbol}:${pair.tokenB.symbol} pair`,
          images,
        },
      };

      position.key = this.appToolkit.getPositionKey(position, ['id']);
      return position;
    }), 'id');

    positions.forEach(dcaPosition => {
      const [tokenAAddress, tokenBAddress] = sortTokens(dcaPosition.from.address, dcaPosition.to.address);

      const toWithdraw = dcaPosition.current.idleSwapped;
      const remainingLiquidity = dcaPosition.current.remainingLiquidity;

      contractPositionsByKey[`${tokenAAddress}-${tokenBAddress}`].positions += 1;

      if (dcaPosition.from.address === tokenAAddress) {
        contractPositionsByKey[`${tokenAAddress}-${tokenBAddress}`].tokenALiquidity = contractPositionsByKey[`${tokenAAddress}-${tokenBAddress}`].tokenALiquidity.add(BigNumber.from(remainingLiquidity));
      } else {
        contractPositionsByKey[`${tokenAAddress}-${tokenBAddress}`].tokenBLiquidity = contractPositionsByKey[`${tokenAAddress}-${tokenBAddress}`].tokenBLiquidity.add(BigNumber.from(remainingLiquidity));
      }
      if (dcaPosition.to.address === tokenAAddress) {
        contractPositionsByKey[`${tokenAAddress}-${tokenBAddress}`].tokenALiquidity = contractPositionsByKey[`${tokenAAddress}-${tokenBAddress}`].tokenALiquidity.add(BigNumber.from(toWithdraw));
      } else {
        contractPositionsByKey[`${tokenAAddress}-${tokenBAddress}`].tokenBLiquidity = contractPositionsByKey[`${tokenAAddress}-${tokenBAddress}`].tokenBLiquidity.add(BigNumber.from(toWithdraw));
      }
    });

    const contractPositions: ContractPosition[] = Object.values(contractPositionsByKey).map(position => {
      const tokens: WithMetaType<BaseTokenBalance>[] = [];

      if (position.tokenA) {
        tokens.push(drillBalance(position.tokenA, position.tokenALiquidity.toString()));
      }
      if (position.tokenB) {
        tokens.push(drillBalance(position.tokenB, position.tokenBLiquidity.toString()));
      }

      const balanceUSD = sumBy(tokens, t => t.balanceUSD);

      return {
        type: ContractType.POSITION,
        address: dcaHubAddress,
        appId,
        groupId,
        network,
        tokens,
        dataProps: {
          id: position.dataProps.id,
          liquidity: balanceUSD,
          tokenALiquidity: position.tokenALiquidity.toString(),
          tokenBLiquidity: position.tokenBLiquidity.toString(),
        },
        displayProps: {
          ...position.displayProps,
          secondaryLabel: `${position.positions} active positions`
        },
      }
    });

    return contractPositions;
  }
}
