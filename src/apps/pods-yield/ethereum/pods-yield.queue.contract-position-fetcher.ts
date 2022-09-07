import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PodsYieldContractFactory } from '../contracts';
import { PODS_YIELD_DEFINITION } from '../pods-yield.definition';

import { strategyAddresses, strategyDetails } from './config';

const appId = PODS_YIELD_DEFINITION.id;
const groupId = PODS_YIELD_DEFINITION.groups.queue.id;
const network = Network.ETHEREUM_MAINNET;

export type PodsYieldQueueContractPositionDataProps = {
  totalValueQueued: number;
};

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumPodsYieldQueueContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PodsYieldContractFactory) private readonly podsYieldContractFactory: PodsYieldContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);

    const positions = await Promise.all(
      strategyAddresses.map(async strategyAddress => {
        const contract = this.podsYieldContractFactory.vault({
          address: strategyAddress,
          network,
        });

        // Find the underlying asset, usually stETH
        const [underlyingTokenAddressRaw] = await Promise.all([
          multicall
            .wrap(contract)
            .asset()
            .catch(() => ''),
        ]);

        // Get the market price of this token
        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
        const underlyingToken = baseTokenDependencies.find(v => v.address === underlyingTokenAddress);
        if (!underlyingToken) return null;
        const tokens = [underlyingToken];

        const [queuedAssets] = await Promise.all([multicall.wrap(contract).totalIdleAssets()]);
        const totalValueQueued = Number(queuedAssets) / 10 ** 18;

        const details = strategyDetails[strategyAddress.toLowerCase()] || strategyDetails.standard;

        const label = `Queued ${underlyingToken.symbol} in ${details.title}`;
        const images = getImagesFromToken(underlyingToken);
        const secondaryLabel = buildDollarDisplayItem(underlyingToken.price);

        const position: ContractPosition<PodsYieldQueueContractPositionDataProps> = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address: strategyAddress,
          network,
          tokens,
          dataProps: {
            totalValueQueued,
          },
          displayProps: {
            label,
            images,
            secondaryLabel,
          },
        };

        return position;
      }),
    );

    return _.compact(positions);
  }
}
