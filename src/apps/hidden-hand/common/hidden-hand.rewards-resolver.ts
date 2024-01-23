import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { BigNumber, BigNumberish, ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { NETWORK_IDS, Network } from '~types';

import { HiddenHandViemContractFactory } from '../contracts';

type PROTOCOL = {
  identifier: string;
  name: string;
  address: string;
};

export type HiddenHandReward = {
  account: string;
  amount: string;
};

type HiddenHandTokenDistribution = {
  [tokenAddress: string]: HiddenHandReward[];
};

type HiddenHandNetworkDistribution = {
  [network: string]: HiddenHandTokenDistribution;
};

export type HiddenHandDistribution = {
  [market: string]: HiddenHandNetworkDistribution;
};

export type HiddenHandRewardsDefinition = {
  address: string;
  name: string;
  key: string;
};

export const BASE_URL = 'https://api.github.com/repositories/601325176/contents/hidden-hand';

export const PROTOCOLS: Partial<Record<Network, Record<string, PROTOCOL>>> = {
  [Network.ETHEREUM_MAINNET]: {
    'aura-v1': {
      identifier: '0x5e51a542c76cdda7bcb5d69b1e2bf07c1a998341e5beb4af3c5b69c005b70825',
      name: 'Aura Market v1',
      address: '0x642c59937a62cf7dc92f70fd78a13cee0aa2bd9c',
    },
    'balancer-v1': {
      identifier: '0xb774acb85c844ceba5af7a7d2c1ae87bec3d9ae928aa7bb14ad9ece203e2880e',
      name: 'Balancer Market v1',
      address: '0x7cdf753b45ab0729bcfe33dc12401e55d28308a9',
    },
    'bunni-v1': {
      identifier: '0x8a75c3397e6ffb49519b2146b302b17c035c5ddb56f68f446d4e9d783b627b59',
      name: 'Bunni Market v1',
      address: '0x78c45fbdb71e7c0fbdfe49bdefdacdcc4764336f',
    },
    'floordao-v1': {
      identifier: '0xea125272d66c2905372eb5bb67f587bb1326982b752406b04f21eab88014eb5e',
      name: 'FloorDao Market v1',
      address: '0x20c0d06626e8b0c9f423e7f2abe26fde1910fd8c',
    },
    'frax-v1': {
      identifier: '0x84f1507b912f1235ce5c9c3679acf3fc7c4d23e0bf12df6a77b304487f1be36f',
      name: 'Frax Market v1',
      address: '0x123683885310851ca29e83ae3ff3e2490d4420cd',
    },
    'idlefinance-v1': {
      identifier: '0x2c3e88884f3181f0d8bf3fa7cc2bd22a2d1738474ad18a37b3f278e23ca9bddd',
      name: 'Idlefinance Market v1',
      address: '0xfe01f497552f7aef64112cf3082385eb876697ae',
    },
    'ribbon-v1': {
      identifier: '0x988d53da848cb078e69126eb281e9ee771e8d4a96ff13be429f95d50b37ac195',
      name: 'Ribbon Market v1',
      address: '0xdc9e0f10671660148bc71c36a38647470c8f9939',
    },
    'saddle-v1': {
      identifier: '0xc1e7f5e342317dd9db36fe2a84a5218b1dbbc1357eb3d71a8e20c32aa73ce43c',
      name: 'Saddle Market v1',
      address: '0x13aebf77f51fa3d3c091d2ab5e1a736aeb6551f9',
    },
    'tokemak-v1': {
      identifier: '0x58f03fb76e1ff5dff3ee4fd620e274794abedbf6393dc5900fbee85f701a3705',
      name: 'Tokemak Market v1',
      address: '0x7816b3d0935d668bcfc9a4aab5a84ebc7ff320cf',
    },
    'aura-v2': {
      identifier: 'AURA',
      name: 'Aura Market v2',
      address: '0xcbf242f20d183b4116c22dd5e441b9ae15b0d35a',
    },
    'balancer-v2': {
      identifier: 'BALANCER',
      name: 'Balancer Market v2',
      address: '0x45bc37b18e73a42a4a826357a8348cdc042ccbbc',
    },
    'bunni-v2': {
      identifier: 'BUNNI',
      name: 'Bunni Market v2',
      address: '0x175b01ef7cea8615b1d9485bc827378ea5d50c86',
    },
    'floordao-v2': {
      identifier: 'FLOOR_DAO',
      name: 'FloorDao Market v2',
      address: '0x19302c4ec309b3913e8be41025dcf66a562bda42',
    },
    'frax-v2': {
      identifier: 'FRAX',
      name: 'Frax Market v2',
      address: '0x2694214a4ea6a2c9a9427aa12251705b67e86960',
    },
    'ribbon-v2': {
      identifier: 'RIBBON',
      name: 'Ribbon Market v2',
      address: '0x97a45f52e5edd775923a8de3f5373d41da5dda73',
    },
    'pendle-v2': {
      identifier: 'PENDLE',
      name: 'Pendle Market v2',
      address: '0xf12e79c95d3c13e2ab4f8222d698daa53df17ad8',
    },
    'harvester-v2': {
      identifier: '',
      name: 'Reward Harvester',
      address: '0xd23aa7edf42cd3fc4cd391faabc0c207b1c86542',
    },
  },
  [Network.OPTIMISM_MAINNET]: {
    'aura-v1': {
      identifier: '0x5e51a542c76cdda7bcb5d69b1e2bf07c1a998341e5beb4af3c5b69c005b70825',
      name: 'Aura Market v1',
      address: '0x054d189225e66438a4d88441507cfa3193fa34a2',
    },
    'aura-v2': {
      identifier: 'AURA',
      name: 'Aura Market v2',
      address: '0x679c5c5828367db9005fdea80faa45ae7b881791',
    },
    'balancer-v2': {
      identifier: 'BALANCER',
      name: 'Balancer Market v2',
      address: '0xea1aac67b6ad9005e1551a4085fffe5aef0f3f09',
    },
    'harvester-v2': {
      identifier: '',
      name: 'Reward Harvester',
      address: '0x4573f58461acd1a6c743d9cde34a142ca18b6873',
    },
  },
  [Network.ARBITRUM_MAINNET]: {
    'aura-v2': {
      identifier: 'AURA',
      name: 'Aura Market v2',
      address: '0x928b06229a3f4bc7806d80fe54e48e777bb74536',
    },
    'pendle-v2': {
      identifier: 'PENDLE',
      name: 'Pendle Market v2',
      address: '0x12ca7c85db4cd7f03704ccce2311c95895cf17f5',
    },
    'harvester-v2': {
      identifier: '',
      name: 'Reward Harvester',
      address: '0xca795dc6f668add4801d2b92cf36c8fbcbeb8ac4',
    },
  },
};

export const REWARD_DISTRIBUTOR: Record<string, Partial<Record<Network, string>>> = {
  v1: {
    [Network.ETHEREUM_MAINNET]: '0x0b139682d5c9df3e735063f46fb98c689540cf3a',
    [Network.OPTIMISM_MAINNET]: '0x0b139682d5c9df3e735063f46fb98c689540cf3a',
  },
  v2: {
    [Network.ETHEREUM_MAINNET]: '0xa9b08b4ceec1ef29edec7f9c94583270337d6416',
    [Network.OPTIMISM_MAINNET]: '0x7354bb6842e421773e7b78f8875a1b85991677c0',
    [Network.ARBITRUM_MAINNET]: '0x0a390de04b7717b078cf5c8a7eb891130d4a843b',
  },
  harvester: {
    [Network.ETHEREUM_MAINNET]: '0xd23aa7edf42cd3fc4cd391faabc0c207b1c86542',
    [Network.OPTIMISM_MAINNET]: '0x4573f58461acd1a6c743d9cde34a142ca18b6873',
    [Network.ARBITRUM_MAINNET]: '0xca795dc6f668add4801d2b92cf36c8fbcbeb8ac4',
  },
};

/**
 * Retrieves claimable rewards for an account.
 * See: https://github.com/redacted-cartel/distributions/blob/master/hidden-hand/README.md#important-note
 * for reference on how this works
 */
@Injectable()
export class HiddenHandRewardsResolver {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HiddenHandViemContractFactory) protected readonly contractFactory: HiddenHandViemContractFactory,
  ) {}

  @Cache({
    key: `studio:hidden-hand:claimable-raw-data`,
    ttl: 60 * 60 * 12, // 12hrs
  })
  private async getRawData(): Promise<HiddenHandDistribution> {
    const resV1 = await axios.get('https://api.hiddenhand.finance/distribution/v1');
    const resV2 = await axios.get('https://api.hiddenhand.finance/distribution/v2');
    const distribution: HiddenHandDistribution = {};

    for (const item of resV1.data.data) {
      for (const [market, networkDistribution] of Object.entries(item)) {
        distribution[`${market}-v1`] = networkDistribution as HiddenHandNetworkDistribution;
      }
    }

    for (const item of resV2.data.data) {
      for (const [market, networkDistribution] of Object.entries(item)) {
        distribution[`${market}-v2`] = networkDistribution as HiddenHandNetworkDistribution;
      }
    }

    return distribution as HiddenHandDistribution;
  }

  async getData(): Promise<HiddenHandDistribution> {
    return await this.getRawData();
  }

  async getClaimableDistribution(address: string, network: Network): Promise<HiddenHandDistribution> {
    const claimableDistribution: HiddenHandDistribution = {};
    const distribution = await this.getTotalRewards(address, network);
    const networkId = NETWORK_IDS[network] || '';

    for (const market in distribution) {
      const protocol = PROTOCOLS[network]?.[market];
      if (!protocol) continue;

      for (const token in distribution[market][networkId]) {
        const rewards = distribution[market][networkId][token];
        let distributor: string;
        let rewardIdentifier: string;

        if (market == 'harvester-v2') {
          rewardIdentifier = token;
          distributor = 'harvester';
        } else {
          distributor = market.slice(-2);
          distributor == 'v1'
            ? (rewardIdentifier = ethers.utils.solidityKeccak256(['bytes32', 'address'], [protocol.identifier, token]))
            : (rewardIdentifier = ethers.utils.solidityKeccak256(['string', 'address'], [protocol.identifier, token]));
        }
        const claimedAmount = await this.getClaimedRewards(address, rewardIdentifier, distributor, network);
        const netRewards = rewards.map(reward => {
          const netAmount = BigNumber.from(reward.amount).sub(claimedAmount).toString();
          return { ...reward, amount: netAmount };
        });
        if (!claimableDistribution[market]) {
          claimableDistribution[market] = {};
        }

        if (!claimableDistribution[market][networkId]) {
          claimableDistribution[market][networkId] = {};
        }
        claimableDistribution[market][networkId][token] = netRewards;
      }
    }

    return claimableDistribution;
  }

  async getTotalRewards(address: string, network: Network): Promise<HiddenHandDistribution> {
    const distribution = await this.getRawData();
    const filteredDistribution: HiddenHandDistribution = {};
    const networkId = NETWORK_IDS[network] || '';
    for (const market in distribution) {
      const filteredMarket: { [tokenAddress: string]: HiddenHandReward[] } = {};
      for (const tokenAddress in distribution[market][networkId]) {
        const rewards = distribution[market][networkId][tokenAddress];
        const filteredRewards = rewards.filter(reward => reward.account === address);
        if (filteredRewards.length > 0) {
          filteredMarket[tokenAddress] = filteredRewards;
        }
      }
      if (Object.keys(filteredMarket).length > 0) {
        if (!filteredDistribution[market]) {
          filteredDistribution[market] = {};
        }
        filteredDistribution[market][networkId] = filteredMarket;
      }
    }

    return filteredDistribution;
  }

  async getClaimedRewards(
    address: string,
    rewardsIdentifier: string,
    distributor: string,
    network: Network,
  ): Promise<BigNumberish> {
    const distributorAddress = REWARD_DISTRIBUTOR[distributor][network] || '';
    if (distributor === 'harvester') {
      const rewardDistributor = this.contractFactory.hiddenHandHarvester({
        address: distributorAddress,
        network,
      });
      try {
        const claimedAmount = await rewardDistributor.read.claimed([rewardsIdentifier, address]);
        return claimedAmount;
      } catch (error) {
        return BigNumber.from(0);
      }
    } else {
      const harvester = this.contractFactory.hiddenHandRewardDistributor({ address: distributorAddress, network });
      try {
        const claimedAmount = await harvester.read.claimed([rewardsIdentifier, address]);
        return claimedAmount;
      } catch (error) {
        return BigNumber.from(0);
      }
    }
  }
}
