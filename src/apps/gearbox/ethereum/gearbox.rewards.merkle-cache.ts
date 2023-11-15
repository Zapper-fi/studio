import { Inject } from '@nestjs/common';
import axios from 'axios';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MerkleCache } from '~position/template/merkle.cache';
import { Network } from '~types';

import { GearboxViemContractFactory } from '../contracts';

type GearboxMerkleClaim = {
  amount: string;
  index: number;
  proof: string[];
};

type GearboxMerkleClaimResponse = {
  merkleRoot: string;
  toBlock: number;
  tokenTotal: string;
  claims: Record<string, GearboxMerkleClaim>;
};

export const GEAR_TOKEN = '0xba3335588d9403515223f109edc4eb7269a9ab5d';
export const AIRDROP_DISTRIBUTOR = '0xa7df60785e556d65292a2c9a077bb3a8fbf048bc';

export class EthereumGearboxRewardsMerkleCache extends MerkleCache<GearboxMerkleClaim> {
  appId = 'gearbox';
  groupId = 'rewards';
  network = Network.ETHEREUM_MAINNET;

  constructor(
    @Inject(APP_TOOLKIT) appToolkit: IAppToolkit,
    @Inject(GearboxViemContractFactory) private readonly contractFactory: GearboxViemContractFactory,
  ) {
    super(appToolkit);
  }

  async resolveMerkleData(): Promise<Record<string, Record<string, GearboxMerkleClaim>>> {
    const allPermutations: string[] = [];
    const allHexCharacters = '01233456789abcdef';
    for (let i = 0; i < allHexCharacters.length; i++) {
      for (let j = 0; j < allHexCharacters.length; j++) {
        allPermutations.push(allHexCharacters[i] + allHexCharacters[j]);
      }
    }
    const airdropDistributorContract = this.contractFactory.airdropDistributor({
      address: AIRDROP_DISTRIBUTOR,
      network: this.network,
    });
    const merkleRoot = await airdropDistributorContract.read.merkleRoot();
    const urls = allPermutations.map(
      p =>
        `https://raw.githubusercontent.com/Gearbox-protocol/rewards/master/merkle/mainnet_${merkleRoot.replace(
          '0x',
          '',
        )}/${p}.json`,
    );
    const allResponses = await Promise.all(
      urls.map(url =>
        axios.get<GearboxMerkleClaimResponse>(url).then(r => {
          const claimsData = r.data.claims;
          return Object.fromEntries(
            Object.entries(claimsData).map(([key, val]) => [key, { index: val.index, amount: val.amount }]),
          );
        }),
      ),
    );
    const allData = _.merge({}, ...allResponses);

    return { [GEAR_TOKEN]: allData };
  }
}
