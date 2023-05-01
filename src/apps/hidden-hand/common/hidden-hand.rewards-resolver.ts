import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { BigNumber, ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { NETWORK_IDS, Network } from '~types';

import { HiddenHandContractFactory } from '../contracts';

type PROTOCOL = {
  hash: string,
  name: string,
  address: string,
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
    aura: { hash: '0x5e51a542c76cdda7bcb5d69b1e2bf07c1a998341e5beb4af3c5b69c005b70825', name: 'Aura Market', address: '0x642c59937a62cf7dc92f70fd78a13cee0aa2bd9c' },
    balancer: { hash: '0xb774acb85c844ceba5af7a7d2c1ae87bec3d9ae928aa7bb14ad9ece203e2880e', name: 'Balancer Market', address: '0x7cdf753b45ab0729bcfe33dc12401e55d28308a9' },
    bunni: { hash: '0x8a75c3397e6ffb49519b2146b302b17c035c5ddb56f68f446d4e9d783b627b59', name: 'Bunni Market', address: '0x78c45fbdb71e7c0fbdfe49bdefdacdcc4764336f' },
    floordao: { hash: '0xea125272d66c2905372eb5bb67f587bb1326982b752406b04f21eab88014eb5e', name: 'FloorDao Market', address: '0x20c0d06626e8b0c9f423e7f2abe26fde1910fd8c' },
    frax: { hash: '0x84f1507b912f1235ce5c9c3679acf3fc7c4d23e0bf12df6a77b304487f1be36f', name: 'Frax Market', address: '0x123683885310851ca29e83ae3ff3e2490d4420cd' },
    idlefinance: { hash: '0x2c3e88884f3181f0d8bf3fa7cc2bd22a2d1738474ad18a37b3f278e23ca9bddd', name: 'Idlefinance Market', address: '0xfe01f497552f7aef64112cf3082385eb876697ae' },
    ribbon: { hash: '0x988d53da848cb078e69126eb281e9ee771e8d4a96ff13be429f95d50b37ac195', name: 'Ribbon Market', address: '0xdc9e0f10671660148bc71c36a38647470c8f9939' },
    saddle: { hash: '0xc1e7f5e342317dd9db36fe2a84a5218b1dbbc1357eb3d71a8e20c32aa73ce43c', name: 'Saddle Market', address: '0x13aebf77f51fa3d3c091d2ab5e1a736aeb6551f9' },
    tokemak: { hash: '0x58f03fb76e1ff5dff3ee4fd620e274794abedbf6393dc5900fbee85f701a3705', name: 'Tokemak Market', address: '0x7816b3d0935d668bcfc9a4aab5a84ebc7ff320cf' },
  },
  [Network.OPTIMISM_MAINNET]: {
    aura: { hash: '0x5e51a542c76cdda7bcb5d69b1e2bf07c1a998341e5beb4af3c5b69c005b70825', name: 'Aura Market', address: '0x054d189225e66438a4d88441507cfa3193fa34a2' },
  },
};

export const REWARD_DISTRIBUTOR: Partial<Record<Network, string>> = {
  [Network.ETHEREUM_MAINNET]: '0x0b139682d5c9df3e735063f46fb98c689540cf3a',
  [Network.OPTIMISM_MAINNET]: '0x0b139682d5c9df3e735063f46fb98c689540cf3a',
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
    @Inject(HiddenHandContractFactory) protected readonly contractFactory: HiddenHandContractFactory,
  ) { }

  @Cache({
    key: `studio:hidden-hand:claimable-raw-data`,
    ttl: 60 * 60 * 24, // 24hrs
  })
  private async getRawData(): Promise<HiddenHandDistribution> {
    const response = await axios.get(BASE_URL);
    const markets = (response.data as any[]).filter((d: any) => d.type === 'dir');
    const tokenRewards: HiddenHandDistribution = {};

    // Loop through each market folder
    for (const market of markets) {
      if (!tokenRewards[market.name]) {
        tokenRewards[market.name] = {};
      }
      const networksResponse = await axios.get(market.url);
      const networks = networksResponse.data as any[];
      // Loop through each network folder
      for (const network of networks) {
        const networkName = network.name;
        const url = network.url.split('?')[0]; // Remove ref=master
        const filesResponse = await axios.get(`${url}/latest`);
        const tokens = (filesResponse.data as any[]).filter(file => file.type === 'file');
        if (!tokenRewards[market.name][networkName]) {
          tokenRewards[market.name][networkName] = {};
        }
        // Loop through each file
        for (const token of tokens) {
          const tokenAddress = token.name.split('.')[0]; // Remove extension
          const tokenDistribution = await axios.get(token.download_url);
          if (!tokenRewards[market.name][networkName]) {
            tokenRewards[market.name][networkName] = {};
          }
          tokenRewards[market.name][networkName][tokenAddress] = tokenDistribution.data as HiddenHandReward[];
        }
      }
    }

    return tokenRewards;
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
        const rewardIdentifier = ethers.utils.solidityKeccak256(['bytes32', 'address'], [protocol.hash, token])
        const claimedAmount = await this.getClaimedRewards(address, rewardIdentifier, network);
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
    // Loop through each market
    for (const market in distribution) {
      const filteredMarket: { [tokenAddress: string]: HiddenHandReward[] } = {};
      // Loop through each token
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

  async getClaimedRewards(address: string, rewardsIdentifier: string, network: Network): Promise<BigNumber> {
    const distributor = REWARD_DISTRIBUTOR[network] || '';
    const contract = this.contractFactory.hiddenHandRewardDistributor({ address: distributor, network });
    try {
      const claimedAmount = await contract.claimed(rewardsIdentifier, address);
      return claimedAmount;
    } catch (error) {
      console.log(error)
      return BigNumber.from(0);
    }
  }
}
