import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { SynthetixSingleStakingRoiStrategy } from '~apps/synthetix';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, locked, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { AURA_DEFINITION } from '../aura.definition';
import { AuraContractFactory, AuraLocker } from '../contracts';

const appId = AURA_DEFINITION.id;
const groupId = AURA_DEFINITION.groups.locker.id;
const network = Network.ETHEREUM_MAINNET;

type AuraLockerQuery = {
  auraLocker: {
    totalSupply: string;
    rewardData: {
      token: { id: string };
      rewardRate: string;
    }[];
  };
};

const AURA_LOCKER_QUERY = gql`
  {
    auraLocker(id: "auraLocker") {
      totalSupply
      rewardData {
        rewardRate
        token {
          id
        }
      }
    }
  }
`;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAuraLockerContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) private readonly auraContractFactory: AuraContractFactory,
    @Inject(SynthetixSingleStakingRoiStrategy) private readonly roiStrategy: SynthetixSingleStakingRoiStrategy,
  ) {}

  async getPositions() {
    const address = '0x3fa73f1e5d8a792c80f426fc8f84fbf7ce9bbcac';

    const contract = this.auraContractFactory.auraLocker({ address, network });
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId,
      groupIds: [AURA_DEFINITION.groups.chef.id],
      network,
    });

    const allTokens = [...baseTokens, ...appTokens];

    const auraToken = allTokens.find(t => t.address.toLowerCase() === AURA_DEFINITION.token!.address.toLowerCase());
    if (!auraToken) return [];

    const { totalSupply, rewardData } = await this.getAuraLockerData();

    const rewardTokenMatches = compact(
      rewardData.map(({ address, rewardRate }) => {
        const token = allTokens.find(token => token.address.toLowerCase() === address);
        return token ? { token, rewardRate } : null;
      }),
    );

    const lockedToken = locked(auraToken);
    const unlockedToken = supplied(auraToken);
    const rewardTokens = rewardTokenMatches.map(({ token }) => claimable(token));
    const tokens = [lockedToken, unlockedToken, ...rewardTokens];

    const liquidity = (Number(totalSupply) / 10 ** lockedToken.decimals) * lockedToken.price;

    const roisStrategy = this.roiStrategy.build<AuraLocker>({
      resolveRewardRates: async () => rewardTokenMatches.map(({ rewardRate }) => rewardRate),
    });
    const rois = await roisStrategy({
      contract,
      multicall,
      rewardTokens,
      address,
      network,
      stakedToken: lockedToken,
      liquidity,
    });

    const position: ContractPosition = {
      type: ContractType.POSITION,
      appId,
      groupId,
      address,
      network,
      tokens,
      dataProps: {
        liquidity,
        rois,
      },
      displayProps: {
        label: 'Vote-locked Aura (vlAURA)',
        images: [getTokenImg(lockedToken.address, network)],
        statsItems: [
          { label: 'APR', value: buildPercentageDisplayItem(rois.yearlyROI * 100) },
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
        ],
      },
    };

    return [position];
  }

  private async getAuraLockerData() {
    const {
      auraLocker: { rewardData, totalSupply },
    } = await this.appToolkit.helpers.theGraphHelper.request<AuraLockerQuery>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/aurafinance/aura',
      query: AURA_LOCKER_QUERY,
    });
    return {
      totalSupply: BigNumber.from(totalSupply),
      rewardData: rewardData.map(({ token: { id }, rewardRate }) => ({ address: id.toLowerCase(), rewardRate })),
    };
  }
}
