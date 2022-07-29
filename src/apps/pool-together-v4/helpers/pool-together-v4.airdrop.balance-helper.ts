import { Inject } from '@nestjs/common';
import axios from 'axios';
import { ethers } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherV4ContractFactory } from '../contracts';
import { POOL_TOGETHER_V4_DEFINITION } from '../pool-together-v4.definition';

type GetAirdropTokenBalanceParams = {
  address: string;
  network: Network;
  airDropAddressDataUrl?: string;
  airDropToken?: string;
};

export class PoolTogetherV4AirdropTokenBalancesHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV4ContractFactory) private readonly contractFactory: PoolTogetherV4ContractFactory,
  ) {}

  async getBalances({ address, network, airDropAddressDataUrl }: GetAirdropTokenBalanceParams) {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const checksumAddress = ethers.utils.getAddress(address); // Checksum
    const url = `${airDropAddressDataUrl}?address=${checksumAddress}`;
    const merkleResponseData = await axios
      .get<{ index: number; amount: string; proof: string[] }>(url)
      .then(({ data }) => data)
      .catch(() => null);
    if (!merkleResponseData) return [];

    const merkleAddress = '0xbe1a33519f586a4c8aa37525163df8d67997016f';
    const distributorContract = this.contractFactory.poolTogetherMerkleDistributor({ address: merkleAddress, network });
    const isClaimed = await distributorContract.isClaimed(merkleResponseData.index);
    if (isClaimed) return [];

    const claimableToken = baseTokens.find(p => p.symbol === 'POOL');
    if (!claimableToken) return [];

    const claimableBalanceRaw = String(parseInt(merkleResponseData.amount, 16));
    const claimableTokenBalance = drillBalance(claimableToken, claimableBalanceRaw);
    const tokens = [claimableTokenBalance];
    const balanceUSD = claimableTokenBalance.balanceUSD;

    // Display Props
    const label = `Claimable ${claimableToken.symbol}`;
    const secondaryLabel = buildDollarDisplayItem(claimableToken.price);
    const images = [getTokenImg(claimableToken.address, network)];

    const positionBalance: ContractPositionBalance = {
      type: ContractType.POSITION,
      address: merkleAddress,
      appId: POOL_TOGETHER_V4_DEFINITION.id,
      groupId: POOL_TOGETHER_V4_DEFINITION.groups.claimable.id,
      network,
      tokens,
      balanceUSD,

      dataProps: {},

      displayProps: {
        label,
        secondaryLabel,
        images,
      },
    };

    return [positionBalance];
  }
}
