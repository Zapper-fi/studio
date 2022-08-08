import { Inject, Injectable } from '@nestjs/common';
import { isUndefined, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
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
  dependencies?: AppGroupsDefinition[];
};

@Injectable()
export class DopexSsovContractPositionHelper {
  constructor(
    @Inject(DopexContractFactory) private readonly dopexContractFactory: DopexContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions({
    appId,
    groupId,
    definitions,
    network,
    dependencies = [],
  }: DopexSsovContractPositionHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const tokenSelector = this.appToolkit.getBaseTokenPriceSelector({ tags: { network, appId } });

    const [baseTokens, appTokens] = await Promise.all([
      await tokenSelector.getAll({ network }),
      await this.appToolkit.getAppTokenPositions(...dependencies),
    ]);

    const allTokens = [...appTokens, ...baseTokens];
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

        const depositToken = allTokens.find(v => v.address === depositTokenAddress);
        const rewardTokens = extraRewardTokenAddresses.map(v => allTokens.find(t => t.address === v.toLowerCase()));
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
