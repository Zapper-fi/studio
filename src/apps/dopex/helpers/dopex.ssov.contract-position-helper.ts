import { Inject, Injectable } from '@nestjs/common';
import { compact, isUndefined, range, uniqBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { DopexContractFactory } from '../contracts';

export type DopexSsovContractPositionDataProps = {
  epoch: number;
  strike: number;
};

type DopexSsovDefinition = {
  address: string;
  depositTokenAddress: string;
  extraRewardTokenAddresses?: string[];
};

type DopexSsovContractPositionHelperParams = {
  appId: string;
  groupId: string;
  definitions: DopexSsovDefinition[];
  network: Network;
};

@Injectable()
export class DopexSsovContractPositionHelper {
  constructor(
    @Inject(DopexContractFactory) private readonly dopexContractFactory: DopexContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions({ appId, groupId, definitions, network }: DopexSsovContractPositionHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const tokenSelector = this.appToolkit.getTokenDependencySelector({ tags: { network, context: appId } });

    const tokenDepRequests = definitions.flatMap(({ depositTokenAddress, extraRewardTokenAddresses = [] }) => {
      const deposit = { network, address: depositTokenAddress };
      const extraRewards = extraRewardTokenAddresses.map(address => ({ network, address }));
      return [deposit, ...extraRewards];
    });

    const uniqueTokenDepReqs = uniqBy(tokenDepRequests, ({ address, network }) => `${network}:${address}`);
    const tokenDependencies = await tokenSelector.getMany(uniqueTokenDepReqs).then(deps => compact(deps));

    const ssovContractPositions = await Promise.all(
      definitions.map(async ({ address, depositTokenAddress, extraRewardTokenAddresses = [] }) => {
        // Determine valid epochs to retrieve balances
        const contract = this.dopexContractFactory.dopexDpxSsov({ address, network });
        const wrappedContract = multicall.wrap(contract);
        const currentEpoch = await wrappedContract.currentEpoch().then(Number);
        const nextEpoch = currentEpoch + 1;
        const nextEpochStartTime = await wrappedContract.epochStartTimes(nextEpoch).then(Number);
        const lastValidEpoch = nextEpochStartTime > 0 ? nextEpoch : currentEpoch;
        const epochs = range(1, lastValidEpoch + 1);

        const depositToken = tokenDependencies.find(v => v.address === depositTokenAddress);
        const rewardTokens = extraRewardTokenAddresses.map(v =>
          tokenDependencies.find(t => t.address === v.toLowerCase()),
        );
        if (!depositToken || rewardTokens.some(isUndefined)) return [];

        const positions = await Promise.all(
          epochs.map(async epoch => {
            const epochStrikes = await multicall.wrap(contract).getEpochStrikes(epoch);

            return epochStrikes.map(strikeRaw => {
              const strike = Number(strikeRaw);
              const strikeLabel = Number(strikeRaw) / 10 ** 8; // Price in USDC

              const ssovContractPosition: ContractPosition<DopexSsovContractPositionDataProps> = {
                type: ContractType.POSITION,
                appId: appId,
                groupId: groupId,
                address: address,
                network: network,
                tokens: [supplied(depositToken), ...rewardTokens.map(v => claimable(v!))],
                dataProps: {
                  epoch,
                  strike,
                },
                displayProps: {
                  label: `${getLabelFromToken(depositToken)} SSOV - Epoch ${epoch}, Strike ${strikeLabel}`,
                  secondaryLabel: buildDollarDisplayItem(depositToken.price),
                  images: getImagesFromToken(depositToken),
                  statsItems: [],
                },
              };

              ssovContractPosition.key = this.appToolkit.getPositionKey(ssovContractPosition, ['epoch', 'strike']);
              return ssovContractPosition;
            });
          }),
        );

        return positions.flat();
      }),
    );

    return ssovContractPositions.flat();
  }
}
