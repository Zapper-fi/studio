import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import { fromPairs } from 'lodash';

import { MerkleCache } from '~app-toolkit/helpers/merkle/merkle.cache';
import { Network } from '~types/network.interface';

import { VOTIUM_DEFINITION } from '../votium.definition';

type VotiumRewardsClaim = {
  index: number;
  amount: string;
  proof: string[];
};

type VotiumRewardTokenData = {
  merkleRoot: string;
  tokenTotal: string;
  claims: Record<string, VotiumRewardsClaim>;
};

export type VotiumActiveTokenData = {
  value: string;
  label: string;
  symbol: string;
  decimals: number;
};

@Injectable()
export class EthereumVotiumMerkleCache extends MerkleCache<VotiumRewardsClaim> {
  appId = VOTIUM_DEFINITION.id;
  groupId = VOTIUM_DEFINITION.groups.claimable.id;
  network = Network.ETHEREUM_MAINNET;

  async resolveMerkleData() {
    const { data } = await Axios.get<VotiumActiveTokenData[]>(
      'https://raw.githubusercontent.com/oo-00/Votium/main/merkle/activeTokens.json',
    );

    const claims = await Promise.all(
      data.map(async tok => {
        const { data } = await Axios.get<VotiumRewardTokenData>(
          'https://raw.githubusercontent.com/oo-00/Votium/main/merkle/' + tok.symbol + '/' + tok.symbol + '.json',
        );

        return [tok.value, data.claims];
      }),
    );

    return fromPairs(claims);
  }
}
